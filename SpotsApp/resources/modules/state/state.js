
function stateChange($scope, toState, toParams, distanceService, spotsService, settings, $window) {
    console.log("toStateName", toState.name);

    stateChangeAnimation($scope, toState);
    ignoreMessagesOnStateChange($scope, toState);
    emptyCurrentSpot($scope, toState, toParams, spotsService, settings, distanceService, $window);
    stateChangeLoading($scope, toState);
    loadMapDelayed($scope, toState, distanceService);
}


function stateChangeLoading($scope, toState) {
    if (toState.name === "spot") {
        $scope.isLoading = true;
        $scope.loadingMessage = "Henter detaljer";
    }
}

//Ignore messages (loading and error text)
function ignoreMessagesOnStateChange($scope, toState) {
    if (toState.name === "info") {
        $scope.ignoreMessages = true;
    } else {
        $scope.ignoreMessages = false;
    }
}

//Empty currentSpot if the view is not where the spot is shown
function emptyCurrentSpot($scope, toState, toParms, spotsService, settings, distanceService, $window) {
    if (toState.name !== "spot") {
        $scope.currentSpot = null;
        $scope.currentSpotImage = null;
    } else {
        spots.getCurrentSpot($scope, spotsService, toParms.spotId, settings, distanceService, $window);
    }
}


//Animate hide/show header and footer bars, based on view
function stateChangeAnimation($scope, toState) {

    var toStateName = toState.name;

    //Add body class to fade elements on state change
    $("body").addClass("state--change");

    setTimeout(function () {
        $("body").removeClass("state--change");
    }, 200);

    if (toStateName === "spot") {
        $(".nav-bar-container").show().addClass("show");
    } else {
        $(".nav-bar-container").hide().removeClass("show");
    }
}
            


