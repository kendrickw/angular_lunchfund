/*jslint node: true */
/*global angular, $, $scope, window */
"use strict";

(function () {
    var app = angular.module('main', ['ui.bootstrap', 'ui.router', 'ngCookies']),
        users = [ {
            nick: "Kendrick",
            img: "http://api.randomuser.me/portraits/med/men/20.jpg"
        }, {
            nick: "Joyce",
            img: "http://api.randomuser.me/portraits/med/women/4.jpg"
        }, {
            nick: "Kendrick",
            img: "http://api.randomuser.me/portraits/med/men/20.jpg"
        }, {
            nick: "Joyce",
            img: "http://api.randomuser.me/portraits/med/women/4.jpg"
        }, {
            nick: "Kendrick",
            img: "http://api.randomuser.me/portraits/med/men/20.jpg"
        }, {
            nick: "Joyce",
            img: "http://api.randomuser.me/portraits/med/women/4.jpg"
        }, {
            nick: "Kendrick",
            img: "http://api.randomuser.me/portraits/med/men/20.jpg"
        }, {
            nick: "Joyce",
            img: "http://api.randomuser.me/portraits/med/women/4.jpg"
        }, {
            nick: "Kendrick",
            img: "http://api.randomuser.me/portraits/med/men/20.jpg"
        }, {
            nick: "Joyce",
            img: "http://api.randomuser.me/portraits/med/women/4.jpg"
        }, {
            nick: "Kendrick",
            img: "http://api.randomuser.me/portraits/med/men/20.jpg"
        }, {
            nick: "Joyce",
            img: "http://api.randomuser.me/portraits/med/women/4.jpg"
        } ],
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

    
    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        // For unmatched routes
        $urlRouterProvider.otherwise('/home');

        // Application routes
        $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'templates/home.html'
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'templates/dashboard.html'
        })
        .state('setting', {
            url: '/setting',
            templateUrl: 'templates/setting.html'
        });
    }]);
    
    app.controller('LuncherController', [ '$scope', function ($scope) {
        $scope.currentuser = window.currentuser;
        
        this.getLunchers = function () {
            return users;
        };
    }]);
    
    app.controller('FundController', [ '$scope', function ($scope) {
        $scope.billAmount = 0;
        
        this.calcWhenBillChange = function () {
            if ($scope.billAmount !== 0) {
                $scope.tipsAmount = $scope.billAmount * 0.15;
                $scope.totalAmount = $scope.billAmount + $scope.tipsAmount;
                $scope.lunchfundAmount = 1.23;
            }
        };
        
        this.calcWhenTipsChange = function () {
            if ($scope.tipsAmount !== 0) {
                $scope.lunchfundAmount = 1.23;
            }
        };
        
        this.calcWhenLunchfundChange = function () {
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
    
    app.controller('MasterCtrl', ['$scope', '$cookieStore', function ($scope, $cookieStore) {
        /**
         * Sidebar Toggle & Cookie Control
         */
        var mobileView = 992;

        $scope.getWidth = function() {
            return window.innerWidth;
        };

        $scope.$watch($scope.getWidth, function(newValue, oldValue) {
            if (newValue >= mobileView) {
                if (angular.isDefined($cookieStore.get('toggle'))) {
                    $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
                } else {
                    $scope.toggle = true;
                }
            } else {
                $scope.toggle = false;
            }
        });

        $scope.toggleSidebar = function() {
            $scope.toggle = !$scope.toggle;
            $cookieStore.put('toggle', $scope.toggle);
        };

        window.onresize = function() {
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
        $scope.COPYRIGHT_TEXT = window.COPYRIGHT_TEXT;
        
    }]);
    
    /*
    app.controller('AlertsCtrl', ['$scope', function ($scope) {
        $scope.alerts = [{
            type: 'success',
            msg: 'Thanks for visiting! Feel free to create pull requests to improve the dashboard!'
        }, {
            type: 'danger',
            msg: 'Found a bug? Create an issue with as many details as you can.'
        }];

        $scope.addAlert = function() {
            $scope.alerts.push({
                msg: 'Another alert!'
            });
        };

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
    }]);
    */

}());