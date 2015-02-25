/*jslint node: true */
/*global angular, $ */
"use strict";

(function () {
    var app = angular.module('main', ['ui.bootstrap', 'ui.router', 'ngCookies']),
        events = [ {
            date: "20120305",
            billAmount: 14.35,
            lunchfund: 2
        }, {
            date: "20120302",
            billAmount: 240.22,
            lunchfund: 25
        }, {
            date: "20120205",
            billAmount: 140.22,
            lunchfund: 3
        } ];


    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        // For unmatched routes
        $urlRouterProvider.otherwise('/home');

        // Application routes
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'templates/home.html'
        }).state('dashboard', {
            url: '/dashboard',
            templateUrl: 'templates/dashboard.html'
        }).state('setting', {
            url: '/setting',
            templateUrl: 'templates/setting.html'
        });
    }]);

    app.controller('LuncherController', [ '$scope', '$window', '$http', function ($scope, $window, $http) {
        $scope.isCollapsed = true;
        $scope.currentuser = {};
        $scope.attendee = [];
        $scope.nonattendee = [];

        // Propagate lunchfund database entries
        $http.get('/db/lunchers').success(function (data) {
            var k;

            for (k = 0; k < data.length; k += 1) {
                // Place first 5 lunchers as default attendee
                if (k < 5) {
                    $scope.attendee.push(data[k]);
                } else {
                    $scope.nonattendee.push(data[k]);
                }

                // Identify current user based on information available in database record
                if (data[k].firstname === $window.currentuser.firstname &&
                        data[k].lastname === $window.currentuser.lastname) {
                    $scope.currentuser = data[k];
                    $scope.currentuser.email = $window.currentuser.email;
                }
            }
        });

        // Toggle user between attendee and nonattendee
        $scope.toggleuser = function (user) {
            var idx = $scope.attendee.indexOf(user);
            if (idx !== -1) {
                $scope.attendee.splice(idx, 1);
                $scope.nonattendee.push(user);
            } else {
                idx = $scope.nonattendee.indexOf(user);
                $scope.nonattendee.splice(idx, 1);
                $scope.attendee.push(user);
            }
        };

        $scope.sumbit = function () {
            console.log($scope.fundholder);
        };
    }]);

    app.controller('FundController', [ '$scope', '$filter', function ($scope, $filter) {
        $scope.billAmount = 0;
        $scope.tipsAmount = 0;
        $scope.totalAmount = 0;
        $scope.lunchfundAmount = 0;
        $scope.eachPays = 0;
        $scope.totalCollected = 0;

        // Tip percentage
        var tipPercent = 10;

        // Convert a number into a string
        var makeString = function (n) {
            if (!isNaN(n)) {
                return n.toString();
            }
            return n;
        };

// Given a string input of form "1234.55x",
// It discard trailing non-numeric characters, remove decimal point
// and then reformat the numeric characters into currency format
//  i.e. 1 would turn into 0.01
//  i.e. 12 would turn into 0.12
//  i.e. 1.456 would turn into 14.56
var formatMoney = function (val) {
    "use strict";
    // Verify last character entered is /[0-9]/
    var regex = /[0-9]/,
        len   = 0;
    if (!regex.test(val[val.length - 1])) {
        val = val.slice(0, -1);
    }

    // Strip x.yy to xyy
    val = val.replace(".", "");

    // Remove leading zeros
    while (val.length > 1) {
        if (val[0] === '0') {
            val = val.substr(1);
        } else {
            break;
        }
    }

    if (val.length === 0) {
        val = "0.00";
    } else if (val.length === 1) {
        val = "0.0" + val;
    } else if (val.length === 2) {
        val = "0." + val;
    } else {
        len = val.length;
        val = val.substr(0, len - 2) + "." + val.substr(len - 2);
    }

    return val;
}

        // Automatically insert 1/100 decimal into an integer
        var autoDecimal = function (n) {
            if (n) {
                var plainNumber = makeString(n).replace(/\D/g, ''); //remove non-digits
                return parseFloat(plainNumber) / 100;
            }
            return n;
        };

        $scope.calcWhenBillChange = function () {
            if ($scope.billAmount === 0) {
                return;
            }

            var numPerson = 5;

            $scope.billAmount = autoDecimal($scope.billAmount);
            $scope.totalAmount = Math.ceil($scope.billAmount * (1 + tipPercent / 100));
            $scope.tipsAmount = $scope.totalAmount - $scope.billAmount;
            if (numPerson > 0) {
                $scope.eachPays = Math.ceil($scope.totalAmount / numPerson);
            }
            $scope.totalCollected = $scope.eachPays * numPerson;
            $scope.lunchfundAmount = $scope.totalCollected - $scope.totalAmount;
        };

        $scope.calcWhenTipsChange = function () {
            if ($scope.tipsAmount !== 0) {
                $scope.lunchfundAmount = 1.23;
            }
        };

        $scope.calcWhenLunchfundChange = function () {
            if ($scope.lunchfundAmount !== 0) {
                $scope.tipsAmount = $scope.billAmount * 0.15;
            }
        };
    }]);

    app.controller('PastEventController', function () {
        this.pastEvents = events.splice(0, 2);

        this.getPastEvents = function () {
            return this.pastEvents;
        };
    });

    app.controller('MasterCtrl', ['$scope', '$window', '$cookieStore', function ($scope, $window, $cookieStore) {
        /**
         * Sidebar Toggle & Cookie Control
         */
        var mobileView = 992;

        $scope.getWidth = function () {
            return $window.innerWidth;
        };

        $scope.$watch($scope.getWidth, function (newValue, oldValue) {
            if (newValue >= mobileView) {
                if (angular.isDefined($cookieStore.get('toggle'))) {
                    $scope.toggle = !$cookieStore.get('toggle') ? false : true;
                } else {
                    $scope.toggle = true;
                }
            } else {
                $scope.toggle = false;
            }
        });

        $scope.toggleSidebar = function () {
            $scope.toggle = !$scope.toggle;
            $cookieStore.put('toggle', $scope.toggle);
        };

        $window.onresize = function () {
            $scope.$apply();
        };

        // Page selection control
        $scope.allPages = [ {
            id:   0,
            name: "Home",
            description: "",
            icon: "glyphicon glyphicon-home",
            link: "#/home"
        }, {
            id:   1,
            name: "Dashboard",
            description: "Show lunchfund performance",
            icon: "glyphicon glyphicon-dashboard",
            link: "#/dashboard"
        }, {
            id:   2,
            name: "Settings",
            description: "",
            icon: "glyphicon glyphicon-cog",
            link: "#/setting"
        } ];
        $scope.currentPageID = 0;

        // Get current page info (optional input to specify page number)
        $scope.getPage = function (id) {
            var page = id || $scope.currentPageID;
            return $scope.allPages[page];
        };

        $scope.setPage = function (id) {
            $scope.currentPageID = id || 0;
        };

        // variables passed from node.js
        $scope.COPYRIGHT_TEXT = $window.COPYRIGHT_TEXT;

    }]);

}());