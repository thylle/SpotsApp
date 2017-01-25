(function () {
    'use strict';

    angular
        .module('app')
        .service('spotsService', initService);

    initService.$inject = ["$http", "settings"];

    function initService($http, settings) {
        this.getAllSpots = getAllSpots;
        this.getSpotById = getSpotById;
        this.checkInOnSpot = checkInOnSpot;
        this.checkOutOnSpot = checkOutOnSpot;

        var domainUrl = settings.domain;

        function getAllSpots(coords) {
            var apiUrl = "/Umbraco/Api/Spots/GetAllSpots";
            var coordsUrl = "?lat=" + coords.latitude + "&lon=" + coords.longitude;
            var url = domainUrl + apiUrl + coordsUrl;
            
            return $http.get(url);
        }

        function getSpotById(id) {
            var apiUrl = "/Umbraco/Api/Spots/GetSpotById?spotId=" + id;
            var url = domainUrl + apiUrl;

            return $http.get(url);
        }

        function checkInOnSpot(id) {
            var apiUrl = "/Umbraco/Api/Spots/CheckIn?spotId=" + id;
            var url = domainUrl + apiUrl;

            return $http.post(url);
        }

        function checkOutOnSpot(id) {
            var apiUrl = "/Umbraco/Api/Spots/CheckOut?spotId=" + id;
            var url = domainUrl + apiUrl;

            return $http.post(url);
        }
    }
})();