
    var spots = {
        init: function ($scope, spotsService, distanceService, countAttempts) {
            
            countAttempts++;
            console.log("spots init attempts", countAttempts);

            //If we have tried 5 times, we stop trying and just get the spots without it.
            if (countAttempts >= 5) {
                spots.getAllSpots($scope, spotsService, distanceService);
                return;
            }

            spots.getCurrentCoords($scope, spotsService, distanceService, countAttempts);
        },

        getCurrentCoords: function($scope, spotsService, distanceService, countAttempts) {
            
            //Get current coords from service
            $scope.currentCoords = distanceService.getCurrentCoords();
            console.log("currentCoords", $scope.currentCoords);

            if ($scope.currentCoords != null) {
                //Manually override position when debugging - if necessary
                //On iOS we cannot get correct current position. We get somewhere in California. Therefor we set it manually. (it works on devices)
                $scope.currentCoords = setDebugCurrentPosition($scope.currentCoords);
                
                spots.getAllSpots($scope, spotsService, distanceService);
            }
            
            //Else go to spots.init and try again after X seconds
            else {
                setTimeout(function () {
                    $scope.loadingMessage = "Beregner afstand...";
                    $scope.$apply();
                    spots.init($scope, spotsService, distanceService, countAttempts);
                }, 2000);
            }
        },

        //Get all spots
        getAllSpots: function ($scope, spotsService, distanceService) {

            spotsService.getAllSpots($scope.currentCoords).success(function (response) {
                $scope.spots = response;
                console.log("success", response);

                //Show header
                //toggleAnimateHeader(true);

                //Set distance info on every spot
                spots.updateSpotsDistanceInfo($scope, distanceService);

                if ($scope.currentSpot !== null) {
                    distanceService.updateItemDistanceInfo($scope.currentSpot);
                }
            })
            .error(function () {
                $scope.pageFailed = true;
                $scope.isLoading = false;
                $scope.loadingMessage = "";
            });
        },

        //Get Current spot by ID from the URL
        getCurrentSpot: function ($scope, spotsService, id, settings, distanceService, $window) {

            spotsService.getSpotById(id).success(function (response) {
                console.log("getCurrentSpot", response);

                $scope.currentSpot = response;
                $scope.currentSpotImage = settings.domain + $scope.currentSpot.Image + "?width=440&height=248&mode=crop&format=jpg";
                
                //Remove the old cookie and checkedInId from last time the user checked in, if the count has been reset since.
                if ($scope.checkedInId === $scope.currentSpot.Id.toString() && $scope.currentSpot.CheckIns === 0) {
                    $scope.checkedInId = null;
                    $window.localStorage['checkedInId'] = null;
                }

                //Get distance info by Google Maps
                distanceService.updateItemDistanceInfo($scope.currentSpot);

                setTimeout(function() {
                    $scope.isLoading = false;
                    $scope.loadingMessage = "";
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$apply();
                }, 1000);

            }).error(function () {
                $scope.pageFailed = true;
                $scope.isLoading = false;
                $scope.loadingMessage = "Der skete en fejl på dette spot - prøv igen senere";
            });
        },
        
        //Adding "driving" distance from Google to every spot
        updateSpotsDistanceInfo: function ($scope, distanceService) {
            console.log("updateSpotsDistanceInfo");

            for (var i = 0; i < $scope.spots.length; i++) {
                var item = $scope.spots[i];

                if (item.Latitude !== "" && item.Longitude !== "") {
                    distanceService.updateItemDistanceInfo(item);
                }
            }

            //Hide loading
            setTimeout(function() {
                $scope.isLoading = false;
                $scope.loadingMessage = "";
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$apply();
            }, 1000);
        }
    }






