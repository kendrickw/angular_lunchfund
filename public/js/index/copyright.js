/*jslint node: true */
/*global angular, $ */
"use strict";

(function () {
    var app = angular.module('copyright', []);

    app.directive('copyright', function () {
        return {
            scope: {},
            restrict: 'AE',
            templateUrl: 'templates/copyright.html',
            replace: true,
            controller: 'CopyrightController',
            controllerAs: 'CopyrightCtrl'
        };
    });

    app.controller('CopyrightController', [ '$window', function ($window) {
        var me = this;

        angular.extend(me, {
            'COPYRIGHT_TEXT': $window.COPYRIGHT_TEXT
        });
    }]);

}());