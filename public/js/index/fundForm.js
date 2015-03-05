/*jslint node: true */
/*global angular, $ */
"use strict";

(function () {
    var app = angular.module('fundForm', ['globalFactory', 'alertService']);

    app.directive('fundForm', function () {
        return {
            scope: {},
            restrict: 'AE',
            templateUrl: 'templates/fundform.html',
            replace: true,
            controller: 'FundController',
            controllerAs: 'FundCtrl'
        };
    });

    app.controller('FundController', [ '$http', 'global', 'alert', function ($http, global, alert) {
        var me = this;

        angular.extend(me, {
            alert: alert,
            today: new Date(),
            eventdate: new Date(),
            attendee: function () { return global.get('attendee'); },
            billAmount: "",
            tipsAmount: 0,
            totalAmount: 0,
            tipPercent: 10,
            eachPays: 0,
            fundholder: "",
            dateOpened: false,
            dateOptions: {
                'show-weeks': false,
                'max-mode': 'day'
            }
        });

        var lunchfundAmount = 0,
            tipPercent = 10;           // Tip percentage

        // Date picker dialog
        function dateOpen($event) {
            $event.preventDefault();
            $event.stopPropagation();
            me.dateOpened = true;
        }

        function calculateLunchFund() {
            if (!me.billAmount) {
                return;
            }

            me.totalAmount = Math.ceil(me.billAmount * (1 + tipPercent / 100));
            me.tipsAmount = me.totalAmount - me.billAmount;
            me.tipPercent = me.tipsAmount / me.billAmount * 100;

            var numPerson = me.attendee().length,
                totalCollected;
            if (numPerson > 0) {
                me.eachPays = Math.ceil(me.totalAmount / numPerson);
            }
            totalCollected = me.eachPays * numPerson;
            lunchfundAmount = totalCollected - me.totalAmount;
        }

        function getLunchfundAmount() {
            calculateLunchFund();
            return lunchfundAmount;
        }

        function verifysubmit() {
            if (!me.billAmount) {
                me.alert.add("danger", "Bill Amount '" + me.billAmount + "' is not valid.");
                return false;
            }
            if (!me.fundholder) {
                me.alert.add("danger", "Please specify a fundholder.");
                return false;
            }
            if (!me.attendee().length) {
                me.alert.add("danger", "No one is going to lunch?");
                return false;
            }
            return true;
        }

        function submit() {
            var entry = {
                time: me.eventdate,
                bill: me.billAmount,
                totalpaid: me.totalAmount,
                fund: lunchfundAmount,
                attendee: me.attendee(),
                fundholder: me.fundholder,
                submitter: global.get('loginUser')
            };
            if (!verifysubmit()) {
                return;
            }
            $http.post('db/event', entry).success(function (data) {
                global.get('events').unshift(entry);
                me.alert.add("success", "Lunchfund submitted successfully.");
            }).error(function (error, status, headers, config) {
                me.alert.add("danger", JSON.stringify(error));
            });
        }

        // Add functions to model
        angular.extend(me, {
            dateOpen: dateOpen,
            getLunchfundAmount: getLunchfundAmount,
            submit: submit
        });
    }]);

}());