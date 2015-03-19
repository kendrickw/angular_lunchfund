/*jslint node: true */
/*global angular, $ */
"use strict";

(function () {
    var app = angular.module('fundStat', ['globalFactory', 'fundFactory']);

    app.directive('fundStat', function () {
        return {
            scope: {},
            restrict: 'AE',
            templateUrl: 'app/fund-stat/fund-stat.html',
            replace: true,
            controller: 'FundStatController',
            controllerAs: 'FundStatCtrl'
        };
    });

    app.controller('FundStatController', [ '$http', 'global', 'luncherstat', function ($http, global, luncherstat) {
        var me = this,
            fundholderstatStates = [
                {
                    expand: false,
                    icon: 'navigation:expand-more',
                    text: 'Expand'
                }, {
                    expand: true,
                    icon: 'navigation:expand-less',
                    text: 'Collapse'
                }
            ],
            lunchoutingstatStates = [
                {
                    expand: false,
                    icon: 'navigation:expand-more',
                    text: 'Expand'
                }, {
                    expand: true,
                    icon: 'navigation:expand-less',
                    text: 'Collapse'
                }
            ];

        angular.extend(me, {
            fundholderstatMode: fundholderstatStates[0],
            fundholderstat: [],
            lunchoutingstatMode: lunchoutingstatStates[0],
            lunchoutingstat: []
        });

        $http.get('/db/fundholderstat').success(function (rows) {
            var k;

            for (k = 0; k < rows.length; k += 1) {
                me.fundholderstat.push({
                    username: global.getLuncher(rows[k].fundholder).username,
                    fund: rows[k].funds
                });
            }
        });

        luncherstat.getData().then(function (rows) {
            var k;

            // Sort according to fund contribution in desc order
            rows.sort(function (a, b) {
                return b.meal_count - a.meal_count;
            });

            for (k = 0; k < rows.length; k += 1) {
                me.lunchoutingstat.push({
                    username: global.getLuncher(rows[k].luncher_id).username,
                    meal_count: rows[k].meal_count
                });
            }
        });

        function togglefundholder() {
            me.fundholderstatMode = me.fundholderstatMode.expand ? fundholderstatStates[0] : fundholderstatStates[1];
        }
        function togglelunchouting() {
            me.lunchoutingstatMode = me.lunchoutingstatMode.expand ? lunchoutingstatStates[0] : lunchoutingstatStates[1];
        }

        angular.extend(me, {
            togglefundholder: togglefundholder,
            togglelunchouting: togglelunchouting
        });
    }]);

}());