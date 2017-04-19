(function () {
    'use strict';

    angular
        .module('app')
        .service('distanceService', initService);

    initService.$inject = ["$http"];

    function initService($http) {
        this.getCurrentCoords = getCurrentCoords;
        this.updateItemDistanceInfo = updateItemDistanceInfo;

        var currentCoords = null;

        function getCurrentCoords() {
            navigator.geolocation.getCurrentPosition(function(pos){
                currentCoords = pos.coords;
            }, function(error){

                //TODO RETURN Latitude 0.0 Longitude 0.0, if error ------------------------------ TODO //

                //console.log('Error getting current position \n code: '    + error.code    + '\n' +
                //    'message: ' + error.message + '\n');
            });

            return currentCoords;
        }
        
        //Get request for google maps distance data (distance and driving time)
        function getDistanceInfo(currentLatitude, currentLongitude, spotLatitude, spotLongitude) {
            var googleApiKey = "&key=AIzaSyD-mzmZW2hh4fsg0WnnyhiIMkpCApvI2sU";
            var googleDistanceUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&language=da";
            var originsUrl = "&origins=" + currentLatitude + "," + currentLongitude;
            var destinationsUrl = "&destinations=" + spotLatitude + "," + spotLongitude;
            var finalDistanceUrl = googleDistanceUrl + originsUrl + destinationsUrl + googleApiKey;

            return $http.get(finalDistanceUrl);
        }

        function updateItemDistanceInfo(spot) {
            if (spot.Latitude !== "" && spot.Longitude !== "" && currentCoords) {
                //Get precise driving distance and duration from Google
                getDistanceInfo(currentCoords.latitude, currentCoords.longitude, spot.Latitude, spot.Longitude).then(function (response) {
                    var elements = response.data.rows[0].elements[0];

                    if (elements.status !== "ZERO_RESULTS") {
                        spot.DrivingDistance = elements.distance.text;
                        spot.DrivingDuration = elements.duration.text;
                    }
                });
            }
        }
    }
})();