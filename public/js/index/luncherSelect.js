/*jslint node: true */
/*global angular, $ */
"use strict";

(function () {
    var app = angular.module('luncherSelect', ['globalFactory']);

    app.directive('luncherSelect', function () {
        return {
            scope: {},
            restrict: 'AE',
            templateUrl: 'templates/luncher-select.html',
            replace: true,
            controller: 'LuncherController',
            controllerAs: 'LuncherCtrl'
        };
    });

    app.controller('LuncherController', [ '$scope', '$modal', 'global', function ($scope, $modal, global) {
        var me = this;

        angular.extend(me, {
            editMode: false,
            lunchers: function () { return global.get('lunchers'); },
            attendee: function () { return global.get('attendee'); }
        });

        function isAttending(user) {
            var idx = me.attendee().indexOf(user);
            return idx !== -1;
        }

        // Toggle user between attendee and nonattendee
        function toggle(user) {
            var idx = me.attendee().indexOf(user);
            if (idx !== -1) {
                me.attendee().splice(idx, 1);
            } else {
                me.attendee().push(user);
            }
        }

        function toggleEdit() {
            me.editMode = !me.editMode;
        }

        // Add functions to model
        angular.extend(me, {
            toggleEdit: toggleEdit,
            isAttending: isAttending,
            toggle: toggle
        });
    }]);

}());