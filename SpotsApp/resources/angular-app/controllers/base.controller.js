

(function () {
    initController.$inject = ["$rootScope", "$scope", "$timeout", "$state", "$window", "spotsService", "distanceService", "settings"];

    angular
        .module("app")
        .controller("baseController", initController);

    function initController($rootScope, $scope, $timeout, $state, $window, spotsService, distanceService, settings) {
        $scope.domain = settings.domain;
        $scope.isLoading = true;
        $scope.pageFailed = false;
        $scope.ignoreMessages = false;
        $scope.mapCreated = false;
        $scope.mapActive = false;
        $scope.overviewActive = false;
        $scope.spots = [];
        $scope.currentSpot = null;
        $scope.categoryFilter = '';
        $scope.userCheckedIn = $window.localStorage['userCheckedIn'] !== "true" ? false : $window.localStorage['userCheckedIn'];

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
        $scope.toggleCheckIn = function () {
            checkIn.toggle($scope, $window, spotsService, settings);
        }

        $scope.openLinkInBrowser = function(link) {
            window.open(link, '_system', 'location=yes');
            return false;
        }

        //On state change
        //This is initialized on load as well.
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

            //State change functions
            stateChange($scope, toState, toParams, distanceService, spotsService, settings);
        });
    }
})();


