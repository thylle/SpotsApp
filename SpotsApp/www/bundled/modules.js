
var checkIn = {
    init: function ($scope, $window, spotsService, settings) {
        //Check-in scope function
        $scope.checkIn = function () {
            $scope.inProgress = true;
            $scope.currentSpot.CheckIns = "...";

            if ($scope.checkedInId === null || $scope.checkedInId === "null") {
                checkIn.checkIn($scope, $window, spotsService, settings);
            }
            //If user is already checked in somewhere, we check the user out before checking-in
            else {
                //Check-out on old spot
                spotsService.checkOutOnSpot($scope.checkedInId);
                console.log("checked out before checking in, id:", $scope.checkedInId);

                setTimeout(function () {
                    //Check-in on new spot
                    checkIn.checkIn($scope, $window, spotsService, settings);
                }, 500);
            }
        }
        //Check-out scope function
        $scope.checkOut = function () {
            $scope.inProgress = true;
            $scope.currentSpot.CheckIns = "...";
            checkIn.checkOut($scope, $window, spotsService, settings);
        }
    },

    checkIn: function ($scope, $window, spotsService, settings) {
        spotsService.checkInOnSpot($scope.currentSpot.Id).success(function () {
            //Set scope variable and local storage
            $scope.inProgress = false;
            $scope.checkedInId = $scope.currentSpot.Id;
            $window.localStorage['checkedInId'] = $scope.currentSpot.Id;

            console.log("checked in, id:", $scope.checkedInId);

            spots.getCurrentSpot($scope, spotsService, $scope.currentSpot.Id, settings);
        })
        .error(function () {
            //TODO Error message
            alert("*** ERROR *** Check-In");
        });
    },

    checkOut: function ($scope, $window, spotsService, settings) {
        spotsService.checkOutOnSpot($scope.checkedInId).success(function () {

            console.log("checked out, id:", $scope.checkedInId);

            //Set scope variable and local storage
            $scope.inProgress = false;
            $scope.checkedInId = null;
            $window.localStorage['checkedInId'] = null;

            spots.getCurrentSpot($scope, spotsService, $scope.currentSpot.Id, settings);
        })
        .error(function () {
            //TODO Error message
            alert("*** ERROR *** Check-Out");
        });
    }   
}


//Close All Info Windows
var infoWindows = [];
function closeAllInfoWindows() {
    for (var i = 0; i < infoWindows.length; i++) {
        infoWindows[i].close();
    }
}

//Set dynamic markers
function setMarkers(map, scope) {

    for (var i = 0; i < scope.spots.length; i++) {
        var spot = scope.spots[i];
        var spotId = spot.Id;
        var spotName = spot.Name;
        var lat = scope.spots[i].Latitude;
        var long = scope.spots[i].Longitude;
        var markerIcon = "img/icon-marker.png";

        //If element don't have lat and long, we stop adding the marker
        if (lat != "" && long != "") {
            if (spot.Category == "Kite") {
                markerIcon = "img/icon-marker-kite.png";
            }
            if (spot.Category == "Cable") {
                markerIcon = "img/icon-marker-wake.png";
            }

            var position = new google.maps.LatLng(lat, long);

            var marker = new google.maps.Marker({
                map: map,
                title: spotName,
                position: position,
                icon: markerIcon
            });

            var infowindow = new google.maps.InfoWindow();
            infoWindows.push(infowindow);

            var content = '<h4 style="min-width: 110px;">' + spotName + '</h4>'
                    + '<div class="clearfix">'
                        + '<p style="margin: 0;">' + '<i class="icon ion-android-car"></i>' + spot.DrivingDistance + '</p>'
                        + '<p>' + '<i class="icon ion-android-time"></i>' + spot.DrivingDuration + '</p>'
                    + '</div>'
                    + '<p><a href="#/spot/' + spotId + '" class="button button-outline button-positive">Se spottet</a></p>';

            google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
                return function () {
                    closeAllInfoWindows();

                    infowindow.setContent(content);
                    infowindow.open(map, marker);
                };
            })(marker, content, infowindow));
        }
    }
}

function createGoogleMaps(scope, currentLocation) {

    var locationHorsens = new google.maps.LatLng(55.861175, 9.845964);

    var mapOptions = {
        center: locationHorsens,
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    map.setCenter(currentLocation);

    new google.maps.Marker({
        position: currentLocation,
        map: map,
        title: "My Location",
        icon: "img/icon-marker.png"
    });

    setMarkers(map, scope);

    scope.map = map;
}


//Timeout to make sure Google and data is ready and to show the loading "spinner"
function loadMapDelayed($scope, toState, distanceService) {

    if (toState.name == "map" && !$scope.pageFailed) {
        $scope.mapActive = true;

        //Check if map is already loaded - if not, load it
        if (!$scope.mapCreated) {
            $scope.isLoading = true;
            $scope.loadingMessage = "Henter kort";

            setTimeout(function () {
                createGoogleMaps($scope, distanceService.getCurrentPosition());
            }, 1000);

            setTimeout(function () {
                $scope.isLoading = false;
                $scope.loadingMessage = "";
                $scope.mapCreated = true;
                $scope.$apply();
                console.log("map created");
            }, 2000);
        }
    }
    else {
        $scope.mapActive = false;
    }
}
(function () {
    'use strict';

    angular
        .module('app')
        .service('spotsService', initService);

    initService.$inject = ["$http", "settings"];

    function initService($http, settings) {
        this.getAllSpots = getAllSpots;
        this.getSpotById = getSpotById;
        this.checkInOnSpot = checkInOnSpot;
        this.checkOutOnSpot = checkOutOnSpot;

        var domainUrl = settings.domain;

        function getAllSpots() {
            var apiUrl = "/Umbraco/Api/Spots/GetAllSpots";
            var url = domainUrl + apiUrl;
            
            return $http.get(url);
        }

        function getSpotById(id) {
            var apiUrl = "/Umbraco/Api/Spots/GetSpotById?spotId=" + id;
            var url = domainUrl + apiUrl;

            return $http.get(url);
        }

        function checkInOnSpot(id) {
            var apiUrl = "/Umbraco/Api/Spots/CheckIn?spotId=" + id;
            var url = domainUrl + apiUrl;

            return $http.post(url);
        }

        function checkOutOnSpot(id) {
            var apiUrl = "/Umbraco/Api/Spots/CheckOut?spotId=" + id;
            var url = domainUrl + apiUrl;

            return $http.post(url);
        }
    }
})();

    var spots = {
        init: function () {

        },

        //Get all spots
        getAllSpots: function ($scope, $timeout, spotsService, distanceService) {
            spotsService.getAllSpots().success(function (response) {
                $scope.spots = response;
                $scope.loadingMessage = "";
                console.log("success", response);

                //Get current position + a number to count attempts
                spots.getCurrentPosition(0, $scope, distanceService);
            })
            .error(function () {
                alert("*** ERROR *** All Spots");
                $scope.pageFailed = true;
                $scope.isLoading = false;
                $scope.loadingMessage = "";
            });
        },

        //Get Current spot by ID from the URL
        getCurrentSpot: function ($scope, spotsService, id, settings) {
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

                setTimeout(function() {
                    $scope.isLoading = false;
                    $scope.loadingMessage = "";
                    $scope.$apply();
                }, 500);

            }).error(function () {
                alert("*** ERROR *** Current Spot");
                $scope.pageFailed = true;
                $scope.isLoading = false;
                $scope.loadingMessage = "";
            });
        },

        //Get users current position, with max 5 attempts
        getCurrentPosition: function (countAttempts, $scope, distanceService) {
            countAttempts++;
            $scope.loadingMessage = "Beregner afstande";

            console.log("getCurrentPosition CountAttempts", countAttempts);

            //If we have tried 5 times, we stop trying and hide the loading screen
            if (countAttempts >= 5) {
                $scope.isLoading = false;
                $scope.loadingMessage = "";
                $scope.$apply();
                return;
            }

            //Get current position and continue the flow 
            if (distanceService.getCurrentPosition() != null) {
                spots.updateSpotsDistanceInfo($scope, distanceService);

                if ($scope.currentSpot != null) {
                    distanceService.updateItemDistanceInfo($scope.currentSpot);
                }
            }
            //Else try again after X seconds
            else {
                setTimeout(function () {
                    spots.getCurrentPosition(countAttempts, $scope, distanceService);
                }, 2000);
            }
        },

        //Adding distance from Google to every spot
        updateSpotsDistanceInfo: function ($scope, distanceService) {
            console.log("updateSpotsDistanceInfo");

            for (var i = 0; i < $scope.spots.length; i++) {
                var item = $scope.spots[i];

                if (item.Latitude != "" && item.Longitude != "") {
                    distanceService.updateItemDistanceInfo(item);
                }
            }

            //Hide loading
            setTimeout(function() {
                $scope.isLoading = false;
                $scope.loadingMessage = "";
                $scope.$apply();
            }, 500);
        }
    }








function stateChange($scope, toState, toParams, distanceService, spotsService, settings) {

    console.log("toStateName", toState.name);

    stateChangeAnimation($scope, toState);
    ignoreMessagesOnStateChange($scope, toState);
    emptyCurrentSpot($scope, toState, toParams, spotsService, settings);
    stateChangeLoading($scope, toState);
    loadMapDelayed($scope, toState, distanceService);
}


function stateChangeLoading($scope, toState) {
    if (toState.name == "spot") {
        $scope.isLoading = true;
        $scope.loadingMessage = "Henter detaljer";
    }
}

//Ignore messages (loading and error text)
function ignoreMessagesOnStateChange($scope, toState) {
    if (toState.name == "info") {
        $scope.ignoreMessages = true;
    } else {
        $scope.ignoreMessages = false;
    }
}

//Empty currentSpot if the view is not where the spot is shown
function emptyCurrentSpot($scope, toState, toParms, spotsService, settings) {
    if (toState.name != "spot") {
        $scope.currentSpot = null;
        $scope.currentSpotImage = null;
    } else {
        spots.getCurrentSpot($scope, spotsService, toParms.spotId, settings);
    }
}

//Animate hide/show header and footer bars, based on view
function stateChangeAnimation($scope, toState) {

    var toStateName = toState.name;
    var tabHideClass = "tab-nav--hide";
    var headerFilterHideClass = "header-filter--hide";

    //Add body class to fade elements on state change
    $("body").addClass("state--change");

    setTimeout(function () {
        $("body").removeClass("state--change");
    }, 200);

    
    //Hide "header filter" on every page except selected view
    if (toStateName == "list") {
        $("body")
            .removeClass(headerFilterHideClass);
    } else {
        $("body")
            .addClass(headerFilterHideClass);
    }

    //Hide tabs on selected pages
    if (toStateName == "nameOfViwe") {
        $("body").addClass(tabHideClass);
        
    } else {
        $("body").removeClass(tabHideClass);
    }
}
            


