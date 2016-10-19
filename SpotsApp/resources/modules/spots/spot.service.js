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

        var domainUrl = settings.domain;

        function getAllSpots() {
            var apiUrl = "/Umbraco/Api/Spots/GetAllSpots";
            var url = domainUrl + apiUrl;
            
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
    }
})();