
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

