(function() {
    initController.$inject = ["$rootScope", "$scope", "$timeout", "spotsService", "$http"];

    angular
        .module("app")
        .controller("baseController", initController);

    function initController($rootScope, $scope, $timeout, spotsService, $http) {

        $scope.isLoading = true;
        $scope.spots = [];
        $scope.currentSpot = null;
        $scope.mapCreated = false;
        var currentPosition = null;
        var currentLatitude = null;
        var currentLongitude = null;


        var flow = {
            init: function() {
                flow.getAllSpots();
            },

            //Get all spots
            getAllSpots: function() {
                spotsService.getAllSpots().success(function(response) {
                        $scope.spots = response;

                        console.log("success", response);

                        //Get current position + a number to count attempts
                        flow.getCurrentPosition(0);
                    })
                    .error(function(response) {
                        alert("*** ERROR *** All Spots", response);
                    });
            },

            //Get users current position
            getCurrentPosition: function(countAttempts) {
                countAttempts++;

                console.log("getCurrentPosition CountAttempts", countAttempts);

                //If we have tried 5 times or more, we stop trying and hide the loading screen
                if (countAttempts >= 5) {
                    hideLoading($scope);
                    return;
                }

                navigator.geolocation.getCurrentPosition(function(pos) {
                    currentLatitude = pos.coords.latitude;
                    currentLongitude = pos.coords.longitude;
                    currentPosition = new google.maps.LatLng(currentLatitude, currentLongitude);
                });

                //If the current position is not found - try again after x seconds
                if (currentPosition != null) {
                    flow.addDistancesToSpots();

                    if ($scope.currentSpot != null) {
                        flow.addDistanceToCurrentSpot($scope.currentSpot);
                    }

                } else {
                    $timeout(function() {
                        flow.getCurrentPosition(countAttempts);
                    }, 1000);
                }
            },


//Adding distance from Google to every spot
            addDistancesToSpots: function() {
                console.log("addDistanceToSpots");

                for (var i = 0; i < $scope.spots.length; i++) {
                    var item = $scope.spots[i];

                    if (item.Latitude != "" && item.Longitude != "") {
                        addDistanceInfoToSpot(item, currentLatitude, currentLongitude);
                    }
                }

                //Hide loading
                $timeout(function() {
                    hideLoading($scope);
                }, 800);
            },

            addDistanceToCurrentSpot: function(currentSpot) {
                if (currentSpot.Latitude != "" && currentSpot.Longitude != "" && currentPosition != null) {
                    currentSpot.Distance = getDistanceFromCurrentPosition(currentPosition, currentSpot.Latitude, currentSpot.Longitude);
                }
            }
        }


        //Wait for the document to load
        //We can do this because all content is coming from Angular
        $(window).load(function() {
            flow.init();
        });

        //TODO - Make smarter ------------------------------------------------------------------------------------------------------------------ TODO //
        function addDistanceInfoToSpot(spot, currentLat, currentLong) {

            spot.Distance = getDistanceFromCurrentPosition(currentPosition, spot.Latitude, spot.Longitude);

            spotsService.getDistanceInfo(currentLat, currentLong, spot.Latitude, spot.Longitude).then(function(response) {
                var drivingDistanceText = response.data.rows[0].elements[0].distance.text;
                var drivingDurationText = response.data.rows[0].elements[0].duration.text;

                spot.DrivingDistance = drivingDistanceText;
                spot.DrivingDuration = drivingDurationText;
            });
        }


        //On state change
        //This is initialized on load as well.
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

            stateChange(toState);

            //console.log("toState", toState);
            //console.log("toParams", toParams);

            if (toState.name == "spot") {

                //Get spot by ID
                spotsService.getSpotById(toParams.spotId).success(function(response) {

                    $scope.currentSpot = response;

                    flow.addDistanceToCurrentSpot($scope.currentSpot);

                }).error(function() {
                    alert("ERROR GETTING CURRENT SPOT");
                });

            } else {
                //Empty currentSpot if the view is not where the spot is shown
                $scope.currentSpot = null;
            }

            //Timeout to add data to spots and make view ready
            $timeout(function () {

                //Check if map is already loaded - if not, load it
                var $mapContainer = $("#map");

                if ($mapContainer.length <= 0) {
                    $scope.mapCreated = false;
                }
                if (!$scope.mapCreated && $mapContainer.length > 0) {
                    createGoogleMaps($scope, currentPosition);
                    $scope.mapCreated = true;
                }
            }, 1000);
        });
    }
})();


