/*jslint node: true */
/*global angular, $ */
"use strict";

(function () {
    var app = angular.module('fundChart', ['googlechart', 'globalFactory']);

    app.directive('fundChart', function () {
        return {
            scope: {},
            restrict: 'AE',
            templateUrl: 'templates/fund-chart.html',
            replace: true,
            controller: 'FundChartController',
            controllerAs: 'FundChartCtrl'
        };
    });

    app.controller('FundChartController', [ '$http', '$filter', 'global', function ($http, $filter, global) {
        var me = this,
            lunchers = global.get('lunchers'),
            loginUser = global.get('loginUser'),
            fundchart = {};

        fundchart.type = "BarChart";
        fundchart.cssStyle = "";
        fundchart.data = {
            "cols": [
                {label: "", type: "string"}     // Y-axis label
            ],
            "rows": [
                {c: [
                    {v: ""}                     // blank row reserved for Y axis
                ]}
            ]
        };

        fundchart.options = {
            //"title": "",
            "isStacked": "true",
            "fill": 20,
            //"displayExactValues": true,
            "vAxis": {
                //"title": "",
                "gridlines": {"count": 0}
            },
            "hAxis": {
                "title": "Fund ($)"
            }
        };

        fundchart.formatters = {};

        function getLuncher(id) {
            // Assume lunchers ID is contiguous and in ascending order
            if (id <= lunchers.length &&
                    lunchers[id - 1].id === id) {
                return lunchers[id - 1];
            }

            // Need to do an exhaustive search
            var k;
            for (k = 0; k < lunchers.length; k += 1) {
                if (lunchers[k].id === id) {
                    return lunchers[k];
                }

            }
            console.error('ID#' + id + ' is not a valid luncher ID.');
            return null;
        }

    /*
[{"luncher_id":1,"total_meal_cost":1038.297422,"total_fund_contrib":113.815374},
 {"luncher_id":2,"total_meal_cost":1078.892065,"total_fund_contrib":114.603867},
*/
        // Show the top 3 + the current user + other
        $http.get('/db/luncherstat').success(function (rows) {
            var k,
                top = 3,
                other = {name: 'Other', meal_cost: 0.0, fund_contrib: 0.0};

            // Sort according to fund contribution in desc order
            rows.sort(function (a, b) {
                return b.total_fund_contrib - a.total_fund_contrib;
            });

            for (k = 0; k < rows.length; k += 1) {
                if (k < top || rows[k].luncher_id === loginUser.id) {
                    fundchart.data.cols.push({
                        label: getLuncher(rows[k].luncher_id).username,
                        type: 'number'
                    });
                    fundchart.data.rows[0].c.push({
                        v: rows[k].total_fund_contrib,
                        f: '$' + $filter('number')(rows[k].total_fund_contrib, 2)
                    });
                    /*
                    me.data.push({
                        name: getLuncher(rows[k].luncher_id).username,
                        fund_contrib: rows[k].total_fund_contrib,
                        meal_cost: rows[k].total_meal_cost
                    });
                    */
                } else {
                    other.fund_contrib += rows[k].total_fund_contrib;
                    other.meal_cost += rows[k].total_meal_cost;
                }
            }
            fundchart.data.cols.push({
                label: 'Others',
                type: 'number'
            });
            fundchart.data.rows[0].c.push({
                v: other.fund_contrib,
                f: '$' + $filter('number')(other.fund_contrib, 2)
            });
        });


        me.chart = fundchart;


    }]);

}());