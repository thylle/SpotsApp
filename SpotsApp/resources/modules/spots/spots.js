


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






