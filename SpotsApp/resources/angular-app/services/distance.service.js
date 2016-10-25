﻿(function () {
    'use strict';

    angular
        .module('app')
        .service('distanceService', initService);

    initService.$inject = ["$http"];

    function initService($http) {
        this.getCurrentPosition = getCurrentPosition;
        this.updateItemDistanceInfo = updateItemDistanceInfo;

        var currentPosition = null;
        var currentLatitude = null;
        var currentLongitude = null;


        function getCurrentPosition() {
            navigator.geolocation.getCurrentPosition(function(pos) {
                currentLatitude = pos.coords.latitude;
                currentLongitude = pos.coords.longitude;
                currentPosition = new google.maps.LatLng(currentLatitude, currentLongitude);
            });

            return currentPosition;
        }

        function getDistanceFromCurrentPosition(currentPosition, lat, long) {
            var to = new google.maps.LatLng(lat, long);
            var dist = google.maps.geometry.spherical.computeDistanceBetween(currentPosition, to);
            dist = (dist / 1000).toFixed(1);

            return parseInt(dist);
        }

        function getDistanceInfo(currentLatitude, currentLongitude, spotLatitude, spotLongitude) {

            var googleApiKey = "&key=AIzaSyD-mzmZW2hh4fsg0WnnyhiIMkpCApvI2sU";
            var googleDistanceUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&language=da";
            var originsUrl = "&origins=" + currentLatitude + "," + currentLongitude;
            var destinationsUrl = "&destinations=" + spotLatitude + "," + spotLongitude;

            var finalDistanceUrl = googleDistanceUrl + originsUrl + destinationsUrl + googleApiKey;

            return $http.get(finalDistanceUrl);
        }

        function updateItemDistanceInfo(spot) {

            if (spot.Latitude != "" && spot.Longitude != "" && currentPosition != null) {

                spot.Distance = getDistanceFromCurrentPosition(currentPosition, spot.Latitude, spot.Longitude);

                getDistanceInfo(currentLatitude, currentLongitude, spot.Latitude, spot.Longitude).then(function (response) {
                    var drivingDistanceText = response.data.rows[0].elements[0].distance.text;
                    var drivingDurationText = response.data.rows[0].elements[0].duration.text;

                    spot.DrivingDistance = drivingDistanceText;
                    spot.DrivingDuration = drivingDurationText;
                });
            }
        }
    }
})();