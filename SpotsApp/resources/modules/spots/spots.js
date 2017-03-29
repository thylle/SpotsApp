
    var spots = {
        init: function ($scope, $timeout, spotsService, distanceService, countAttempts) {
            countAttempts++;
            console.log("spots init attempts", countAttempts);

            //If we have tried 10 times, we stop trying and just get the spots without it.
            if (countAttempts >= 10) {
                spots.getAllSpots($scope, $timeout, spotsService, distanceService);
                return;
            }

            //Get current coords
            $scope.currentCoords = distanceService.getCurrentCoords();

            if ($scope.currentCoords != null) {
                console.log("currentCoods", $scope.currentCoords);
                spots.getAllSpots($scope, $timeout, spotsService, distanceService);
            }
            //Else try again after X seconds
            else {
                setTimeout(function () {
                    $scope.loadingMessage = "Beregner afstand...";
                    spots.init($scope, $timeout, spotsService, distanceService, countAttempts);
                }, 3000);
            }
        },

        //Get all spots
        getAllSpots: function ($scope, $timeout, spotsService, distanceService) {

            spotsService.getAllSpots($scope.currentCoords).success(function (response) {
                $scope.spots = response;
                console.log("success", response);

                //Set distance info on every spot
                spots.updateSpotsDistanceInfo($scope, distanceService);

                if ($scope.currentSpot != null) {
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
                $scope.currentSpotImage = settings.domain + $scope.currentSpot.Image + "?width=400&height=200&mode=crop&format=jpg";
                $scope.currentSpotMapsLink = "http://maps.google.com/?q=" + $scope.currentSpot.Latitude + "," + $scope.currentSpot.Longitude;
                // "-45" is to make the arrow point to north = 0deg, 
                // Then we add the current degrees and add 180 to flip it arround
                // This is so that the arrow points in the wind direction instead of against the direction
                if ($scope.currentSpot.Weather) {
                    $scope.currentSpotWindDegCorrected = (-45 + $scope.currentSpot.Weather.WindDirectionDeg) + 180;

                    //Get the correct optimal wind direction degrese to rotate the icon
                    spots.calculateDegFromDirection($scope, $scope.currentSpot.OptimalWindDirection);
                }

                //Remove the old cookie from last time the user checked in - if the count has been reset since.
                if ($scope.checkedInId === $scope.currentSpot.Id && $scope.currentSpot.CheckIns === 0) {
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
        
        //Adding distance from Google to every spot
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
        },

        calculateDegFromDirection: function($scope, direction) {
            var degResult = -45;
            var degOffset = 22.5;

            switch (direction.toUpperCase()) {
                case "NNE":
                    degResult = degResult + (degOffset * 1);
                    break;
                case "NE":
                    degResult = degResult + (degOffset * 2);
                    break;
                case "ENE":
                    degResult = degResult + (degOffset * 3);
                    break;
                case "E":
                    degResult = degResult + (degOffset * 4);
                    break;
                case "ESE":
                    degResult = degResult + (degOffset * 5);
                    break;
                case "SE":
                    degResult = degResult + (degOffset * 6);
                    break;
                case "SSE":
                    degResult = degResult + (degOffset * 7);
                    break;
                case "S":
                    degResult = degResult + (degOffset * 8);
                    break;
                case "SSW":
                    degResult = degResult + (degOffset * 9);
                    break;
                case "SW":
                    degResult = degResult + (degOffset * 10);
                    break;
                case "WSW":
                    degResult = degResult + (degOffset * 11);
                    break;
                case "W":
                    degResult = degResult + (degOffset * 12);
                    break;
                case "WNW":
                    degResult = degResult + (degOffset * 13);
                    break;
                case "NW":
                    degResult = degResult + (degOffset * 14);
                    break;
                case "NNW":
                    degResult = degResult + (degOffset * 15);
                    break;
            }


            $scope.currentSpotOptimalWindDeg = degResult + 180;

            console.log("Direction", direction);
            console.log("currentSpotOptimalWindDeg", degResult + 180);
        }
    }






