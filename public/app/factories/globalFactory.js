/*jslint node: true */
/*global angular, $, navigator */
"use strict";

(function () {
    var app = angular.module('globalFactory', []);

    // Service for storing and getting variables across controllers
    app.factory('global', [ '$location', '$window', '$http', function ($location, $window, $http) {
        var property = {
            locale: navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage),
            development: $window.development,       // Is in development mode?
            loginUser: $window.currentuser,
            lunchers: [],
            attendee: [],
            events: [],
            stocklist: [],
            allPages: [ {
                name: "Home",
                icon: "action:home",
                link: "#/home"
            }, {
                name: "Dashboard",
                icon: "action:dashboard",
                link: "#/dashboard"
            }, {
                name: "Stock",
                icon: "action:trending-up",
                link: "#/stock"
            }, {
                name: "Settings",
                icon: "action:settings",
                link: "#/setting"
            } ]
        };

        function getLuncher(id) {
            var lunchers = property.lunchers,
                k;

            // Assume lunchers ID is contiguous and in ascending order
            if (id <= lunchers.length &&
                    lunchers[id - 1].id === id) {
                return lunchers[id - 1];
            }

            // Need to do an exhaustive search
            for (k = 0; k < lunchers.length; k += 1) {
                if (lunchers[k].id === id) {
                    return lunchers[k];
                }

            }
            console.error('ID#' + id + ' is not a valid luncher ID.');
            return null;
        }

        function getCurrentPage() {
            var k,
                regex = new RegExp($location.path() + "$");
            for (k = 0; k < property.allPages.length; k += 1) {
                if (regex.test(property.allPages[k].link)) {
                    return property.allPages[k];
                }
            }
        }

        // Propagate lunchfund database entries
        $http.get('/db/luncher').success(function (data) {
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
        $http.get('/db/event', {
            params: {
                count: 2
            }
        }).success(function (data) {
            property.events = data;
        });

        return {
            getLuncher: getLuncher,
            getCurrentPage: getCurrentPage,
            get: function (field) {
                return property[field];
            },
            set: function (field, value) {
                property[field] = value;
            }
        };
    }]);

}());