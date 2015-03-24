/*jslint node: true */
/*global angular, $, navigator */
"use strict";

(function () {
    var app = angular.module('index', [
        'ui.router', 'angular-loading-bar',          // other angular stuff
        'ngMaterial', 'templates', 'globalFactory',
        'copyright', 'luncherSelect', 'fundForm', 'pastEvent',
        'fundChart', 'fundStat', 'stockChart'
    ]);

    app.config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', '$mdIconProvider', function ($stateProvider, $urlRouterProvider, $mdThemingProvider, $mdIconProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/home');

        // Application routes
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'app/routes/home.html'
        }).state('dashboard', {
            url: '/dashboard',
            templateUrl: 'app/routes/dashboard.html'
        }).state('stock', {
            url: '/stock',
            templateUrl: 'app/routes/stock.html',
            controller: 'StockController',
            controllerAs: 'StockCtrl'
        }).state('setting', {
            url: '/setting',
            templateUrl: 'app/routes/setting.html'
        });

        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('orange');

        $mdThemingProvider.theme('dark')
            .primaryPalette('yellow')
            .dark();

        // Register icon IDs with sources. Future $mdIcon( <id> ) lookups
        // will load by url and retrieve the data via the $http and $templateCache
        $mdIconProvider
            .icon('action:home', 'images/material-svg/action/ic_home_24px.svg', 24)
            .icon('action:dashboard', 'images/material-svg/action/ic_dashboard_24px.svg', 24)
            .icon('action:settings', 'images/material-svg/action/ic_settings_24px.svg', 24)
            .icon('action:done', 'images/material-svg/action/ic_done_24px.svg', 24)
            .icon('action:exit-to-app', 'images/material-svg/action/ic_exit_to_app_24px.svg', 24)
            .icon('action:account-balance-wallet', 'images/material-svg/action/ic_account_balance_wallet_24px.svg', 24)
            .icon('action:shopping-cart', 'images/material-svg/action/ic_shopping_cart_24px.svg', 24)
            .icon('action:trending-up', 'images/material-svg/action/ic_trending_up_24px.svg', 24)
            .icon('action:trending-down', 'images/material-svg/action/ic_trending_down_24px.svg', 24)
            .icon('content:add-circle', 'images/material-svg/content/ic_add_circle_24px.svg', 24)
            .icon('content:remove-circle', 'images/material-svg/content/ic_remove_circle_24px.svg', 24)
            .icon('content:undo', 'images/material-svg/content/ic_undo_24px.svg', 24)
            .icon('image:edit', 'images/material-svg/image/ic_edit_24px.svg', 24)
            .icon('navigation:chevron-right', 'images/material-svg/navigation/ic_chevron_right_24px.svg', 24)
            .icon('navigation:menu', 'images/material-svg/navigation/ic_menu_24px.svg', 24)
            .icon('navigation:refresh', 'images/material-svg/navigation/ic_refresh_24px.svg', 24)
            .icon('navigation:expand-more', 'images/material-svg/navigation/ic_expand_more_24px.svg', 24)
            .icon('navigation:expand-less', 'images/material-svg/navigation/ic_expand_less_24px.svg', 24)
            .icon('file:cloud-upload', 'images/material-svg/file/ic_cloud_upload_24px.svg', 24);
    }]);

    app.run(['$http', '$templateCache', function ($http, $templateCache) {
        var urls = [
            'images/material-svg/action/ic_home_24px.svg',
            'images/material-svg/action/ic_dashboard_24px.svg',
            'images/material-svg/action/ic_settings_24px.svg',
            'images/material-svg/action/ic_exit_to_app_24px.svg',
            'images/material-svg/action/ic_done_24px.svg',
            'images/material-svg/action/ic_account_balance_wallet_24px.svg',
            'images/material-svg/action/ic_shopping_cart_24px.svg',
            'images/material-svg/action/ic_trending_up_24px.svg',
            'images/material-svg/action/ic_trending_down_24px.svg',
            'images/material-svg/content/ic_add_circle_24px.svg',
            'images/material-svg/content/ic_remove_circle_24px.svg',
            'images/material-svg/content/ic_undo_24px.svg',
            'images/material-svg/image/ic_edit_24px.svg',
            'images/material-svg/navigation/ic_chevron_right_24px.svg',
            'images/material-svg/navigation/ic_menu_24px.svg',
            'images/material-svg/navigation/ic_refresh_24px.svg',
            'images/material-svg/navigation/ic_expand_more_24px.svg',
            'images/material-svg/navigation/ic_expand_less_24px.svg',
            'images/material-svg/file/ic_cloud_upload_24px.svg'
        ];
        // Pre-fetch icons sources by URL and cache in the $templateCache...
        // subsequent $http calls will look there first.
        angular.forEach(urls, function (url) {
            $http.get(url, {cache: $templateCache});
        });

    }]);

    app.controller('MenuController', [ 'global', '$mdSidenav', function (global, $mdSidenav) {
        var me = this,
            getuser = function () { return global.get('loginUser'); },
            userdetail = [{
                title: "Email",
                text: getuser().email
            }, {
                title: "Firstname",
                text: getuser().firstname
            }, {
                title: "Lastname",
                text: getuser().lastname
            }];

        function toggleSidemenu(menuId) {
            $mdSidenav(menuId).toggle();
        }

        function closeSidemenu(menuId) {
            $mdSidenav(menuId).close();
        }

        angular.extend(me, {
            development: global.get('development'),
            allPages: global.get('allPages'),
            getCurrentPage: global.getCurrentPage,
            loginUser: getuser,
            userdetail: userdetail,
            toggleSidemenu: toggleSidemenu,
            closeSidemenu: closeSidemenu
        });

    }]);


    app.controller('StockController', [ 'global', '$http', '$q', '$window', function (global, $http, $q, $window) {
        var me = this,
            querydeferred;

        angular.extend(me, {
            selectedItem: null,
            searchText: null,
            getWatchList: function () { return global.get('stocklist'); }
        });

        // Fake out YAHOO callback
        $window.YAHOO = {Finance: {SymbolSuggest: {}}};
        $window.YAHOO.Finance.SymbolSuggest.ssCallback = function (data) {
            var mapped = data.ResultSet.Result.map(function (entry) {
                return {
                    symbol: entry.symbol,
                    name: entry.name,
                    exchange: entry.exchDisp
                };
            });
            querydeferred.resolve(mapped);
        };

        // Get stock symbols from Yahoo Finance API
        function querySearch(query) {
            querydeferred = $q.defer();

            $http.jsonp('http://d.yimg.com/autoc.finance.yahoo.com/autoc', {
                params: {
                    callback: 'YAHOO.Finance.SymbolSuggest.ssCallback',
                    query: query
                }
            }).error(function (error) {
                querydeferred.reject(error);
            });

            return querydeferred.promise;
        }

        angular.extend(me, {
            querySearch: querySearch
        });

    }]);

}());