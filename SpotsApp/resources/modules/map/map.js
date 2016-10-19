
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