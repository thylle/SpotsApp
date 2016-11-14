
var checkIn = {

    //Let users check-in and out on the current spot
    toggle: function($scope, $window, spotsService, settings) {
        if ($scope.currentSpot != null) {

            //Check In
            if ($scope.userCheckedIn === false) {
                $scope.userCheckedIn = true;
                $window.localStorage['userCheckedIn'] = true;
                $scope.currentSpot.CheckIns = "...";

                spotsService.checkInOnSpot($scope.currentSpot.Id).success(function(response) {
                    console.log("check-in success", response);

                    spots.getCurrentSpot($scope, spotsService, $scope.currentSpot.Id, settings);
                })
                .error(function() {
                    alert("*** ERROR *** Check-In");

                    $scope.userCheckedIn = false;
                });
            }

            //Check Out
            else {
                $scope.userCheckedIn = false;
                $window.localStorage['userCheckedIn'] = false;
                $scope.currentSpot.CheckIns = "...";

                spotsService.checkOutOnSpot($scope.currentSpot.Id).success(function (response) {
                    console.log("check-out success", response);

                    spots.getCurrentSpot($scope, spotsService, $scope.currentSpot.Id, settings);
                })
                .error(function () {
                    alert("*** ERROR *** Check-In");

                    $scope.userCheckedIn = true;
                });
            }
        }    
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

    console.log("creating map");

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

function stateChange($scope, toState, toParams, distanceService, spotsService, settings) {

    console.log("toStateName", toState.name);

    stateChangeAnimation($scope, toState);
    ignoreMessagesOnStateChange($scope, toState);
    emptyCurrentSpot($scope, toState, toParams, spotsService, settings);
    loadMapDelayed($scope, toState, distanceService);
}


//Ignore messages (loading and error text)
function ignoreMessagesOnStateChange($scope, toState) {
    if (toState.name == "about") {
        $scope.ignoreMessages = true;
    } else {
        $scope.ignoreMessages = false;
    }
}

//Timeout to add data to spots and make view ready
function loadMapDelayed($scope, toState, distanceService) {

    if (toState.name == "map") {
        setTimeout(function () {
            //Check if map is already loaded - if not, load it
            var $mapContainer = $("#map");

            if ($mapContainer.length <= 0) {
                $scope.mapCreated = false;
            }
            if (!$scope.mapCreated && $mapContainer.length > 0) {
                createGoogleMaps($scope, distanceService.getCurrentPosition());
                $scope.mapCreated = true;
            }
        }, 1000);
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

                console.log("success", response);

                //Get current position + a number to count attempts
                spots.getCurrentPosition(0, $scope, distanceService);
            })
            .error(function () {
                alert("*** ERROR *** All Spots");
                $scope.pageFailed = true;
                $scope.isLoading = false;
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
                $scope.currentSpotWindDegCorrected = (-45 + $scope.currentSpot.Weather.WindDirectionDeg) + 180;
                    
                })
            .error(function () {
                alert("*** ERROR *** Current Spot");
                $scope.pageFailed = true;
                $scope.isLoading = false;
            });
        },

        //setCurrentSpotFromItem: function ($scope, settings, item) {
        //    $scope.currentSpot = item;
        //    $scope.currentSpotImage = settings.domain + item.Image + "?width=400&height=200&mode=crop&format=jpg";

        //    console.log("set", $scope.currentSpot);
        //},

        //Get users current position
        getCurrentPosition: function (countAttempts, $scope, distanceService) {
            countAttempts++;

            console.log("getCurrentPosition CountAttempts", countAttempts);

            //If we have tried 5 times, we stop trying and hide the loading screen
            if (countAttempts >= 5) {
                $scope.isLoading = false;
                $scope.$apply();
                return;
            }

            //Get current position and continue the flow - Else try again after X seconds
            if (distanceService.getCurrentPosition() != null) {
                spots.updateSpotsDistanceInfo($scope, distanceService);

                if ($scope.currentSpot != null) {
                    distanceService.updateItemDistanceInfo($scope.currentSpot);
                }

            } else {
                setTimeout(function () {
                    spots.getCurrentPosition(countAttempts, $scope, distanceService);
                    $scope.isLoading = false;
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
            $scope.isLoading = false;
        }
    }








var loadingContainer = $(".message__container");
var loadingContent = $(loadingContainer).find(".message__spinner");
var loadingElementClone = "";
var loadingActiveClass = "message__container--active";

function showLoading(scope) {
    scope.isLoading = true;
    //loadingContainer.addClass(loadingActiveClass);

    //$(loadingContent).append(loadingElementClone);
}

function hideLoading(scope) {

    setTimeout(function () {
        scope.isLoading = false;

        //loadingContainer.removeClass(loadingActiveClass);

        //loadingElementClone = $(loadingContent).find("img").clone();

        //remove the loading image from the DOM, to reduce CPU usage because of the animation
        //setTimeout(function () {
        //    $(loadingContent).find("img").remove();
        //}, 1500);
    }, 800);
}

