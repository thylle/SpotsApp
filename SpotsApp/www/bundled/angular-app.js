(function () {
    'use strict';

    angular.module('app', ['ionic', 'ngAnimate'])
        .constant("settings", {
            "domain": "http://0e1b3df6.ngrok.io" //ex. 6b050561.ngrok.io // http://spots.local
        })
        .run(function ($ionicPlatform, $ionicConfig) {
            $ionicPlatform.ready(function () {

                $ionicConfig.views.transition('none');
                $ionicConfig.backButton.text('Tilbage');

                var ismobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);

                if (!ismobile) {
                    return;
                }

                if (cordova.platformId === 'ios' && window.cordova && window.cordova.plugins.Keyboard) {
                    //Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                    // for form inputs)
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                    // Don't remove this line unless you know what you are doing. It stops the viewport
                    // from snapping when text inputs are focused. Ionic handles this internally for
                    // a much nicer keyboard experience.
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
            });
        })
        .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

            $ionicConfigProvider.tabs.position('bottom');

            $stateProvider
                .state('list', {
                    url: '/list',
                    templateUrl: 'templates/list.html'
                })
                .state('map', {
                    url: '/map',
                    templateUrl: 'templates/map.html'
                })
                .state('about', {
                    url: '/about',
                    templateUrl: 'templates/about.html'
                })
                .state('spot', {
                    url: '/spot/:spotId',
                    templateUrl: 'templates/spot.html'
                })
                .state('404', {
                    url: '/404',
                    templateUrl: 'templates/404.html'
                });

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/list');
        });
})();


