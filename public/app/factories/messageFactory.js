/*jslint node: true */
/*global angular, $, navigator */
"use strict";

(function () {
    var app = angular.module('messageFactory', []);

    // Message retrieval
    app.factory('message', [ '$window', function ($window) {
        var property = {
            locale: navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage)
        }, msg = {
            'GENERIC': '{0}',
            'INVALID_BILLAMOUNT': 'Bill Amount {0} is not valid.',
            'INVALID_FUNDHOLDER': 'Please specify a fundholder.',
            'NO_ATTENDEE': 'No one is going to lunch?',
            'SUBMIT_SUCCESS': 'Lunchfund submitted successfully.'
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

        return {
            getMsg: getMsg
        };
    }]);

}());