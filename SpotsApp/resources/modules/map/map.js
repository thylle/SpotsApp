﻿
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