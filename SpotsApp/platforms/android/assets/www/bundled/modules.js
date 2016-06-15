

var loadingContainer = $(".loading");
var loadingContent = $(loadingContainer).find(".loading__content");
var loadingElementClone = "";
var loadingActiveClass = "loading--active";

function showLoading(scope) {
    scope.isLoading = true;

    loadingContainer.addClass(loadingActiveClass);

    $(loadingContent).append(loadingElementClone);
}

function hideLoading(scope) {
    scope.isLoading = false;

    loadingContainer.removeClass(loadingActiveClass);

    loadingElementClone = $(loadingContent).find("img").clone();


    //remove the loading image from the DOM, to reduce CPU usage because of the animation
    setTimeout(function() {
        $(loadingContent).find("img").remove();
    }, 1500);
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
        var name = scope.spots[i].Name;
        var lat = scope.spots[i].Latitude;
        var long = scope.spots[i].Longitude;
        var markerIcon = "http://labs.google.com/ridefinder/images/mm_20_blue.png";

        if (scope.spots[i].Id == 1055 || scope.spots[i].Id == 1056) {
            markerIcon = "http://labs.google.com/ridefinder/images/mm_20_orange.png";
        }

        //If element don't have lat and long, we stop adding the marker
        if (lat == "" && long == "") {
            return;
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

function getDistanceFromCurrentPosition(currentPosition, lat, long) {
    var to = new google.maps.LatLng(lat, long);
    var dist = google.maps.geometry.spherical.computeDistanceBetween(currentPosition, to);
    dist = (dist / 1000).toFixed(1);

    return parseInt(dist);
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


function stateChange(toState) {

    var toStateName = toState.name;

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
            


