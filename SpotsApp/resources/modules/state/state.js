
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
            


