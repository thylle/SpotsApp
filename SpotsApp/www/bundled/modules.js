
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
        var name = scope.spots[i].Name;
        var lat = scope.spots[i].Latitude;
        var long = scope.spots[i].Longitude;
        var markerIcon = "http://labs.google.com/ridefinder/images/mm_20_blue.png";

        //If element don't have lat and long, we stop adding the marker
        if (lat != "" && long != "") {
            if (scope.spots[i].Category == "Kite") {
                markerIcon = "http://labs.google.com/ridefinder/images/mm_20_orange.png";
            }

            var position = new google.maps.LatLng(lat, long);

            var marker = new google.maps.Marker({
                map: map,
                title: name,
                position: position,
                icon: markerIcon
            });


            var infowindow = new google.maps.InfoWindow();
            infoWindows.push(infowindow);

            var content = "<h5>" + name + "</h5>";

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
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    map.setCenter(currentLocation);

    new google.maps.Marker({
        position: currentLocation,
        map: map,
        title: "My Location",
        icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 4,
            fillColor: "#f8ae5f"
        }
    });

    setMarkers(map, scope);

    scope.map = map;
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




function stateChangeAnimation(toState) {

    var toStateName = toState.name;

    console.log("toStateName", toStateName);

    var tabHideClass = "tab-nav--hide";
    var headerFilterHideClass = "header-filter--hide";

    //Add body class to fade elements on state change
    $("body").addClass("state--change");

    setTimeout(function () {
        $("body").removeClass("state--change");
    }, 200);

    //Choose state names which should show the bottom tabs bar
    //List only
    if (toStateName == "list") {
        $("body")
            .removeClass(headerFilterHideClass);
    } else {
        $("body")
            .addClass(headerFilterHideClass);
    }


    //List & Map
    if (toStateName == "list" || toStateName == "map") {
        $("body")
            .removeClass(tabHideClass);
    } else {
        $("body")
            .addClass(tabHideClass);
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
        },

        //Let users check-in on the current spot
        checkIn: function ($scope, spotsService, settings) {
            if ($scope.currentSpot != null) {
                $scope.userCheckedIn = true;

                spotsService.checkInOnSpot($scope.currentSpot.Id).success(function (response) {
                    console.log("check-in success", response);
                    
                    spots.getCurrentSpot($scope, spotsService, $scope.currentSpot.Id, settings);
                })
                .error(function () {
                    alert("*** ERROR *** Check-In");

                    $scope.userCheckedIn = false;
                    $scope.pageFailed = true;
                    $scope.isLoading = false;
                });
            }
        },
    }






