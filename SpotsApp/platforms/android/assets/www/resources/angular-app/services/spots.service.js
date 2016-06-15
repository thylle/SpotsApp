(function () {
    'use strict';

    angular
        .module('app')
        .service('spotsService', initService);

    initService.$inject = ["$http"];

    function initService($http) {
        this.getAllSpots = getAllSpots;
        this.getSpotById = getSpotById;
        this.getDistanceInfo = getDistanceInfo;

        var ngrokUrl = "http://2c3c7b22.ngrok.io";

        function getAllSpots() {
            var ngrokUrl = "http://2c3c7b22.ngrok.io";
            var apiUrl = "/Umbraco/Api/Spots/GetAllSpots";
            var url = ngrokUrl + apiUrl;
            
            return $http.get(url);
        }

        function getSpotById(id) {
            var apiUrl = "/Umbraco/Api/Spots/GetSpotById?spotId=" + id;
            var url = ngrokUrl + apiUrl;

            return $http.get(url);
        }

        function getDistanceInfo(currentLatitude, currentLongitude, spotLatitude, spotLongitude) {

            var googleApiKey = "&key=AIzaSyD-mzmZW2hh4fsg0WnnyhiIMkpCApvI2sU";
            var googleDistanceUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&language=da";
            var originsUrl = "&origins=" + currentLatitude + "," + currentLongitude;
            var destinationsUrl = "&destinations=" + spotLatitude + "," + spotLongitude;

            var finalDistanceUrl = googleDistanceUrl + originsUrl + destinationsUrl + googleApiKey;

            return $http.get(finalDistanceUrl);
        }
    }
})();