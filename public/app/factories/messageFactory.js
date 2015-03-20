/*jslint node: true */
/*global angular, $, navigator */
"use strict";

(function () {
    var app = angular.module('messageFactory', ['ngMaterial']);

    // Message retrieval
    app.factory('message', [ '$window', '$mdDialog', function ($window, $mdDialog) {
        var property = {
            locale: navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage)
        }, msg = {
            'GENERIC': '{0}',
            'INVALID_BILLAMOUNT': 'Bill Amount {0} is not valid.',
            'INVALID_FUNDHOLDER': 'Please specify a fundholder.',
            'NO_ATTENDEE': 'No one is going to lunch?',
            'SUBMIT_SUCCESS': 'Lunchfund submitted successfully.',
            'WATCHLIST_ADD_SUCCESS': '{0} added to watchlist',
            'WATCHLIST_REMOVE_SUCCESS': '{0} removed from watchlist'
        };

        function getMsg(id, subarr) {
            var i, re,
                str = msg[id],
                n = 0;
            if (subarr && subarr.constructor === Array) {
                n = subarr.length;
            }
            for (i = 0; i < n; i += 1) {
                re = new RegExp("\\{" + i + "\\}", "g");
                str = str.replace(re, subarr[i]);
            }
            return str;
        }

        // Display an error dialog
        function showError(id, subarr) {
            var errmsg = getMsg(id, subarr);

            $mdDialog.show(
                $mdDialog.alert()
                    .title('Error')
                    .content(errmsg)
                    .ariaLabel('Error message')
                    .ok('OK')
            );
        }

        // Display an information dialog
        function showInfo(id, subarr) {
            var errmsg = getMsg(id, subarr);

            $mdDialog.show(
                $mdDialog.alert()
                    .content(errmsg)
                    .ariaLabel('Informational message')
                    .ok('OK')
            );
        }

        return {
            getMsg: getMsg,
            showError: showError,
            showInfo: showInfo
        };
    }]);

}());