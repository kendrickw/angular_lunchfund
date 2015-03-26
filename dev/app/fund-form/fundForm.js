/*jslint node: true */
/*global angular, $ */
"use strict";

(function () {
    var app = angular.module('fundForm', ['globalFactory', 'messageFactory', 'ngMessages']);

    app.directive('fundForm', function () {
        return {
            scope: {},
            restrict: 'E',
            templateUrl: 'app/fund-form/fund-form.html',
            replace: true,
            controller: 'FundController',
            controllerAs: 'FundCtrl'
        };
    });

    app.controller('FundController', [ '$http', 'global', 'message', function ($http, global, message) {
        var me = this;

        angular.extend(me, {
            today: new Date(),
            eventdate: new Date(),
            attendee: function () { return global.get('attendee'); },
            billAmount: "",
            baseTipsAmount: 0,      // tip amounts based on 10% calculation
            tipsAmount: 0,          // actual tip amount given
            tipPercent: 0,          // actual tip percent
            tipOffset: 0,           // tip amount adjustment (baseTipsAmount + tipOffset = tipsAmount)
            totalAmount: 0,         // total amount to restaurant
            eachPays: 0,            // each pay amount
            fundholder: ""
        });

        function tipOffsetFloor() {
            return -1 * (Math.ceil(me.baseTipsAmount * 4) / 4).toFixed(2);
        }

        function tipOffsetCeil() {
            return (Math.ceil(me.baseTipsAmount * 4) / 4).toFixed(2);
        }

        // Update various model values based on option provided
        function getLunchfundAmount() {
            if (!me.billAmount) {
                return 0;
            }

            var tipPercent = 10,
                numPerson = me.attendee().length,
                totalAmount,
                totalCollected;
            if (numPerson <= 0) {
                return 0;
            }

            totalAmount = Math.ceil(me.billAmount * (1 + tipPercent / 100));
            me.baseTipsAmount = parseFloat((totalAmount - me.billAmount).toFixed(2));

            me.tipsAmount = me.baseTipsAmount + me.tipOffset;
            if (me.tipsAmount < 0) {
                me.tipsAmount = 0;
            }
            me.tipPercent = me.tipsAmount / me.billAmount * 100;
            me.totalAmount = me.tipsAmount + me.billAmount;

            me.eachPays = Math.ceil(me.totalAmount / numPerson);
            totalCollected = me.eachPays * numPerson;
            return parseFloat((totalCollected - me.totalAmount).toFixed(2));
        }

        function bumpTipsOffset(up) {
            me.tipOffset += up ? 0.25 : -0.25;
        }

        function verifysubmit(ev) {
            if (!me.billAmount) {
                message.showError('INVALID_BILLAMOUNT', [me.billAmount]);
                return false;
            }
            if (!me.fundholder) {
                message.showError('INVALID_FUNDHOLDER');
                return false;
            }
            if (!me.attendee().length) {
                message.showError('NO_ATTENDEE');
                return false;
            }
            return true;
        }

        function submit(ev) {
            var entry = {
                time: me.eventdate,
                bill: me.billAmount,
                totalpaid: me.totalAmount,
                fund: getLunchfundAmount(),
                attendee: me.attendee(),
                fundholder: me.fundholder,
                submitter: global.get('loginUser')
            };

            if (!verifysubmit(ev)) {
                return;
            }
            $http.post('db/event', entry).success(function (data) {
                global.get('events').unshift(entry);
                message.showInfo('SUBMIT_SUCCESS');
            }).error(function (error, status, headers, config) {
                message.showError('GENERIC', [JSON.stringify(error)]);
            });
        }

        // Add functions to model
        angular.extend(me, {
            bumpTipsOffset: bumpTipsOffset,
            tipOffsetFloor: tipOffsetFloor,
            tipOffsetCeil: tipOffsetCeil,
            getLunchfundAmount: getLunchfundAmount,
            submit: submit
        });
    }]);

}());