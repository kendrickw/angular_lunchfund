/*jslint node: true */
/*global angular, $, navigator */
"use strict";

(function () {
    var app = angular.module('globalFactory', []);

    // Service for storing and getting variables across controllers
    app.factory('global', [ '$window', '$http', function ($window, $http) {
        var property = {
            locale: navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage),
            development: $window.development,       // Is in development mode?
            loginUser: $window.currentuser,
            lunchers: [],
            attendee: [],
            events: []
        };

        // Propagate lunchfund database entries
        $http.get('/db/lunchers').success(function (data) {
            var lunchers = property.lunchers,
                attendee = property.attendee,
                loginUser = property.loginUser,
                k;

            for (k = 0; k < data.length; k += 1) {
                // Place first 5 lunchers as default attendee
                if (k < 5) {
                    attendee.push(data[k]);
                }
                lunchers.push(data[k]);

                // Identify current user based on information available in database record
                if (data[k].firstname === loginUser.firstname &&
                        data[k].lastname === loginUser.lastname) {
                    angular.extend(loginUser, data[k]);
                }
            }
        });

        // Get Past couple lunch events
        $http.get('/db/events', {
            params: {
                count: 2
            }
        }).success(function (data) {
            property.events = data;
        });

        return {
            get: function (field) {
                return property[field];
            },
            set: function (field, value) {
                property[field] = value;
            }
        };
    }]);

}());