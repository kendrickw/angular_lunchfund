/*jslint node: true */
/*global angular, $ */
"use strict";

(function () {
    var app = angular.module('luncherSelect', ['globalFactory']);

    app.directive('luncherSelect', function () {
        return {
            scope: {},
            restrict: 'E',
            templateUrl: 'app/luncher-select/luncher-select.html',
            replace: true,
            controller: 'LuncherController',
            controllerAs: 'LuncherCtrl'
        };
    });

    app.controller('LuncherController', [ 'global', function (global) {
        var me = this,
            editStates = [
                {
                    expand: false,
                    icon: 'image:edit',
                    text: 'Edit'
                }, {
                    expand: true,
                    icon: 'action:done',
                    text: 'Done'
                }
            ];

        angular.extend(me, {
            editMode: editStates[0],
            lunchers: function () { return global.get('lunchers'); },
            attendee: function () { return global.get('attendee'); }
        });

        function isAttending(user) {
            var idx = me.attendee().indexOf(user);
            return idx !== -1;
        }

        // Toggle user between attendee and nonattendee
        function toggle(user) {
            var idx;

            idx = me.lunchers().indexOf(user);
            if (idx === -1) {
                // user not part of lunchers, so exit early.
                return;
            }

            idx = me.attendee().indexOf(user);
            if (idx !== -1) {
                me.attendee().splice(idx, 1);
            } else {
                me.attendee().push(user);
            }
        }

        function toggleEdit() {
            me.editMode = me.editMode.expand ? editStates[0] : editStates[1];
        }

        // Add functions to model
        angular.extend(me, {
            toggleEdit: toggleEdit,
            isAttending: isAttending,
            toggle: toggle
        });
    }]);

}());