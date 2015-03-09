/*jslint node: true */
/*global angular, $ */
"use strict";

(function () {
    var app = angular.module('pastEvent', ['globalFactory']);

    app.directive('pastEvent', function () {
        return {
            scope: {},
            restrict: 'AE',
            templateUrl: 'templates/past-event.html',
            replace: true,
            controller: 'EventController',
            controllerAs: 'EventCtrl'
        };
    });

    app.controller('EventController', ['global', function (global) {
        var me = this;

        me.events = function () { return global.get('events'); };
    }]);

}());