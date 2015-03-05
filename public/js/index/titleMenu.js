/*jslint node: true */
/*global angular, $ */
"use strict";

(function () {
    var app = angular.module('titleMenu', ['ngAside', 'globalFactory']);

    app.directive('titleMenu', function () {
        return {
            scope: {},
            restrict: 'AE',
            templateUrl: 'templates/titleMenu.html',
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

    app.controller('MenuController', [ '$aside', 'global', function ($aside, global) {
        var me = this;

        angular.extend(me, {
            allPages: allPages,
            development: global.get('development'),
            currentPageID: function () { return global.get('currentPageID'); },
            loginUser: function () { return global.get('loginUser'); }
        });

        // Page selection control
        function getPage() {
            return me.allPages[me.currentPageID()];
        }

        function openAside(position) {
            $aside.open({
                templateUrl: 'templates/sidemenu.html',
                placement: position,
                size: 'sm',
                backdrop: true,  // Clicking outside the modal, closes the modal
                controller: 'SidemenuController',
                controllerAs: 'SidemenuCtrl'
            });
        }

        angular.extend(me, {
            openAside: openAside,
            getPage: getPage
        });

    }]);

    app.controller('SidemenuController', [ 'global', '$modalInstance', function (global, $modalInstance) {
        var me = this;

        function setPage(id) {
            global.set('currentPageID', id || 0);
        }

        function ok(e) {
            $modalInstance.close();
            e.stopPropagation();
        }

        function cancel(e) {
            $modalInstance.dismiss();
            e.stopPropagation();
        }

        angular.extend(me, {
            ok: ok,
            cancel: cancel,
            allPages: allPages,
            setPage: setPage
        });
    }]);

}());