/*jslint node: true */
/*global angular, $ */
'use strict';

(function () {
    var app = angular.module('alertService', []);

    app.service('alert', function () {
        var alerts = [];

        // type can be:
        //  primary: blue
        //  success: green
        //  info: light blue
        //  warning: orange
        //  danger: red
        function add(type, msg) {
            alerts.push({
                type: type,
                msg: msg
            });
        }

        function closeAlert(index) {
            alerts.splice(index, 1);
        }

        function getAlerts() {
            return alerts;
        }

        return {
            add: add,
            closeAlert: closeAlert,
            getAlerts: getAlerts
        };
    });
}());