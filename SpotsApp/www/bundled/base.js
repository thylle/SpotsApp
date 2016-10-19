

(function () {
    initController.$inject = ["$rootScope", "$scope", "$timeout", "spotsService", "distanceService", "settings"];

    angular
        .module("app")
        .controller("baseController", initController);

    function initController($rootScope, $scope, $timeout, spotsService, distanceService, settings) {
        $scope.domain = settings.domain;
        $scope.isLoading = true;
        $scope.pageFailed = false;
        $scope.mapCreated = false;
        $scope.overviewActive = false;
        $scope.spots = [];
        $scope.currentSpot = null;
        $scope.categoryFilter = '';
        $scope.userCheckedIn = false;

        //TODO API Controller
        $scope.categories = [
            {
                Name: "Alle",
                Filter: ""
            },
            {
                Name: "Kite",
                Filter: "kite"
            },
            {
                Name: "Cable",
                Filter: "cable"
            }
        ];

        //Category filter in the header
        $scope.filterByCategory = function (item) {
            $scope.categoryFilter = item.Filter;
        }

        
        //Wait for the document to load
        //We can do this because all content is coming from Angular
        $(window).load(function () {
            spots.getAllSpots($scope, $timeout, spotsService, distanceService);
        });

        //$scope.setCurrentSpot = function (item) {
        //    spots.setCurrentSpotFromItem($scope, settings, item);
        //}

        //Check in on a spot
        $scope.checkIn = function () {
            spots.checkIn($scope, spotsService, settings);
        }


        //On state change
        //This is initialized on load as well.
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

            //state animations and hiding elements in different states
            stateChange(toState);

            console.log("toParams", toParams.spotId);


            //Empty currentSpot if the view is not where the spot is shown
            if (toState.name != "spot") {
                $scope.currentSpot = null;
                $scope.currentSpotImage = null;
            } else {
                spots.getCurrentSpot($scope, spotsService, toParams.spotId, settings);
            }

            //Timeout to add data to spots and make view ready
            $timeout(function () {

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
        });
    }
})();


