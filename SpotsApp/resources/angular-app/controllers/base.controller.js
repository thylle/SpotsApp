

(function () {
    initController.$inject = ["$rootScope", "$scope", "$state", "$window", "spotsService", "distanceService", "settings"];

    angular
        .module("app")
        .controller("baseController", initController);

    function initController($rootScope, $scope, $state, $window, spotsService, distanceService, settings) {
        $scope.domain = settings.domain;
        $scope.isLoading = true;
        $scope.inProgress = false;
        $scope.pageFailed = false;
        $scope.ignoreMessages = false;
        $scope.mapCreated = false;
        $scope.mapActive = false;
        $scope.currentCoords = null;
        $scope.spots = [];
        $scope.currentSpot = null;
        $scope.categoryFilter = '';
        $scope.checkedIn = false;
        $scope.checkedInId = localStorage.getItem("checkedInId");
        $scope.currentState = null;

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
        
        
        //Refresh app manualy
        $scope.refreshApp = function() {
            $scope.pageFailed = false;
            $scope.isLoading = true;
            $scope.loadingMessage = "";
            $scope.currentCoords = null;

            $state.go('home');

            setTimeout(function () {
                spots.init($scope, spotsService, distanceService, 0);
            }, 500);
        };

        //Pull to refresh
        $scope.doRefresh = function () {
            console.log("pull refreshing -----------------------");
            $scope.currentCoords = null;

            setTimeout(function () {
                spots.init($scope, spotsService, distanceService, 0);
            }, 500);
        };

        //Category filter in the header
        $scope.filterByCategory = function (item) {
            $scope.categoryFilter = item.Filter;
        }
        

        //Wait for the document to load
        //We can do this because all content is coming from Angular
        $(window).load(function () {
            spots.init($scope, spotsService, distanceService, 0);
        });


        //Init Check-In
        checkIn.init($scope, $window, spotsService, settings, distanceService);


        $scope.shortenName = function(string) {
            var length = 50;
            if (string.length >= length) {
                return string.substring(0, length) + "...";
            }

            return string;
        }

        //Open link in browser (external)
        $scope.openLinkInBrowser = function(link) {
            window.open(link, '_system', 'location=yes');
            return false;
        }

        //Get wind direction in degress from e.g. "WNW"
        $scope.calculateWindDegressFromDirection = function(direction) {
            // "calculateWindDegressFromDirection" is a helper function found in "helpers.js"
            return calculateWindDegressFromDirection(direction);
        }
        

        //On state change
        //This is initialized on load as well.
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            //State change functions
            $scope.currentState = toState.name;
            stateChange($scope, toState, toParams, distanceService, spotsService, settings, $window);
        });
    }
})();


