

(function () {
    initController.$inject = ["$rootScope", "$scope", "$timeout", "$state", "$window", "spotsService", "distanceService", "settings"];

    angular
        .module("app")
        .controller("baseController", initController);

    function initController($rootScope, $scope, $timeout, $state, $window, spotsService, distanceService, settings) {
        $scope.domain = settings.domain;
        $scope.isLoading = true;
        $scope.inProgress = false;
        $scope.pageFailed = false;
        $scope.ignoreMessages = false;
        $scope.mapCreated = false;
        $scope.mapActive = false;
        $scope.overviewActive = false;
        $scope.currentCoords = null;
        $scope.spots = [];
        $scope.currentSpot = null;
        $scope.categoryFilter = '';
        $scope.checkedIn = false;
        $scope.checkedInId = localStorage.getItem("checkedInId");

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
        
        $scope.doRefresh = function () {
            console.log("pull refreshing -----------------------");
            $scope.currentCoords = null;

            setTimeout(function() {
                spots.init($scope, $timeout, spotsService, distanceService);
            }, 500);
        };

        //Category filter in the header
        $scope.filterByCategory = function (item) {
            $scope.categoryFilter = item.Filter;
        }
        
        //Wait for the document to load
        //We can do this because all content is coming from Angular
        $(window).load(function () {
            spots.init($scope, $timeout, spotsService, distanceService);
        });

        //Init Check-In
        checkIn.init($scope, $window, spotsService, settings, distanceService);

        //Open link in browser (external)
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


