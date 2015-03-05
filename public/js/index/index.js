/*jslint node: true */
/*global angular, $, navigator */
"use strict";

(function () {
    var app = angular.module('index', ['ui.bootstrap', 'ui.router', 'titleMenu', 'luncherSelect', 'fundForm', 'pastEvent', 'copyright']);

    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        // For unmatched routes
        $urlRouterProvider.otherwise('/home');

        // Application routes
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'templates/home.html'
        }).state('dashboard', {
            url: '/dashboard',
            templateUrl: 'templates/dashboard.html'
        }).state('setting', {
            url: '/setting',
            templateUrl: 'templates/setting.html'
        });
    }]);

}());