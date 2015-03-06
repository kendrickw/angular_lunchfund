/*jslint node: true */
/*global angular, $ */
"use strict";

(function () {
    var app = angular.module('titleMenu', ['globalFactory']);

    app.directive('titleMenu', function () {
        return {
            scope: {},
            restrict: 'AE',
            templateUrl: 'templates/titlemenu.html',
            replace: true,
            controller: 'MenuController',
            controllerAs: 'MenuCtrl'
        };
    });

    var allPages = [ {
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

    app.controller('MenuController', [ '$location', 'global', function ($location, global) {
        var me = this;

        angular.extend(me, {
            allPages: allPages,
            development: global.get('development'),
            currentPageID: 0,
            loginUser: function () { return global.get('loginUser'); },
            navCollapsed: true,  // Navigation responsive collapse
            sidemenuOpen: false  // Side menu state
        });

        // Update current page ID, base on hash location
        var k,
            regex = new RegExp($location.path() + "$");
        for (k = 0; k < allPages.length; k += 1) {
            if (regex.test(allPages[k].link)) {
                me.currentPageID = allPages[k].id;
                break;
            }
        }

        // Page selection control
        function getPage() {
            return me.allPages[me.currentPageID];
        }

        function setPage(id) {
            me.currentPageID = id || 0;
        }

        function toggleNav() {
            me.navCollapsed = !me.navCollapsed;
        }

        function toggleSidemenu() {
            me.sidemenuOpen = !me.sidemenuOpen;
        }

        angular.extend(me, {
            toggleNav: toggleNav,
            toggleSidemenu: toggleSidemenu,
            getPage: getPage,
            setPage: setPage
        });

    }]);

}());