
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
