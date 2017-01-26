
    var spots = {
        init: function ($scope, $timeout, spotsService, distanceService) {
            $scope.currentCoords = distanceService.getCurrentCoords();

            if ($scope.currentCoords != null) {
                spots.getAllSpots($scope, $timeout, spotsService, distanceService);
            }
            //Else try again after X seconds
            else {
                setTimeout(function () {
                    $scope.loadingMessage = "Beregner afstand...";
                    spots.init($scope, $timeout, spotsService, distanceService);
                }, 2000);
            }
        },

        //Get all spots
        getAllSpots: function ($scope, $timeout, spotsService, distanceService) {
            spotsService.getAllSpots($scope.currentCoords).success(function (response) {
                $scope.spots = response;
                console.log("success", response);

                //Set distance info on every spot
                spots.updateSpotsDistanceInfo($scope, distanceService);

                if ($scope.currentSpot != null) {
                    distanceService.updateItemDistanceInfo($scope.currentSpot);
                }
            })
            .error(function () {
                $scope.pageFailed = true;
                $scope.isLoading = false;
                $scope.loadingMessage = "";
            });
        },

        //Get Current spot by ID from the URL
        getCurrentSpot: function ($scope, spotsService, id, settings, distanceService) {

            spotsService.getSpotById(id).success(function (response) {
                console.log("getCurrentSpot", response);
                $scope.currentSpot = response;
                $scope.currentSpotImage = settings.domain + $scope.currentSpot.Image + "?width=400&height=200&mode=crop&format=jpg";
                $scope.currentSpotMapsLink = "http://maps.google.com/?q=" + $scope.currentSpot.Latitude + "," + $scope.currentSpot.Longitude;
                // "-45" is to make the arrow point to north = 0deg, 
                // Then we add the current degrees and add 180 to flip it arround
                // This is so that the arrow points in the wind direction instead of against the direction
                if ($scope.currentSpot.Weather) {
                    $scope.currentSpotWindDegCorrected = (-45 + $scope.currentSpot.Weather.WindDirectionDeg) + 180;
                }

                //Get distance info by Google Maps
                distanceService.updateItemDistanceInfo($scope.currentSpot);

                setTimeout(function() {
                    $scope.isLoading = false;
                    $scope.loadingMessage = "";
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$apply();
                }, 1000);

            }).error(function () {
                $scope.pageFailed = true;
                $scope.isLoading = false;
                $scope.loadingMessage = "Der skete en fejl på dette spot - prøv igen senere";
            });
        },
        
        //Adding distance from Google to every spot
        updateSpotsDistanceInfo: function ($scope, distanceService) {
            console.log("updateSpotsDistanceInfo");

            for (var i = 0; i < $scope.spots.length; i++) {
                var item = $scope.spots[i];

                if (item.Latitude !== "" && item.Longitude !== "") {
                    distanceService.updateItemDistanceInfo(item);
                }
            }

            //Hide loading
            setTimeout(function() {
                $scope.isLoading = false;
                $scope.loadingMessage = "";
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$apply();
            }, 1000);
        }
    }






