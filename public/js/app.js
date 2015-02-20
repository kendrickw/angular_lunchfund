/*jslint node: true */
/*global angular, $, $scope */
"use strict";

(function () {
    var app = angular.module('main', []),
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
        pages = [ {
            id:   0,
            name: "Home",
            icon: "glyphicon glyphicon-home",
            link: "#home"
        }, {
            id:   1,
            name: "Dashboard",
            icon: "glyphicon glyphicon-dashboard",
            link: "#dashboard"
        }, {
            id:   2,
            name: "Settings",
            icon: "glyphicon glyphicon-cog",
            link: "#settings"
        }, {
            id:   3,
            name: "About",
            icon: "glyphicon glyphicon-text-background",
            link: "#about"
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
    
    app.directive("navBar", function () {
        return {
            restrict: 'E',
            templateUrl: "navbar.html",
            controllerAs: 'pageCtrl',
            controller: function () {
                this.menuitems = pages;
                this.currentPage = 0;
        
                // Get current page info (optional input to specify page number)
                this.getPage = function (id) {
                    var page = id || this.currentPage;
                    return this.menuitems[page];
                };
        
                this.setPage = function (id) {
                    this.currentPage = id || 0;
                };
        
                // Get all pages except current page
                this.otherPages = function () {
                    var otherpages = this.menuitems.slice(0);
                    otherpages.splice(this.currentPage, 1);
                    return otherpages;
                };
            }
        };
    });

}());