/*jslint node: true */
/*global angular, $ */
"use strict";

(function () {
    var app = angular.module('fundChart', ['googlechart', 'globalFactory', 'fundFactory']);

    app.directive('fundChart', function () {
        return {
            scope: {},
            restrict: 'AE',
            templateUrl: 'app/fund-chart/fund-chart.html',
            replace: true,
            controller: 'FundChartController',
            controllerAs: 'FundChartCtrl'
        };
    });

    app.controller('FundChartController', [ '$filter', 'global', 'luncherstat', function ($filter, global, luncherstat) {
        var me = this,
            loginUser = global.get('loginUser'),
            bookvchart = {},
            mktvchart = {};

        angular.extend(me, {
            book: bookvchart,
            mkt: mktvchart
        });

        bookvchart.total = 0;
        bookvchart.type = "BarChart";
        bookvchart.cssStyle = "";
        bookvchart.data = {
            "cols": [
                {label: "", type: "string"}     // Y-axis label
            ],
            "rows": [
                {c: [
                    {v: ""}                     // blank row reserved for Y axis
                ]}
            ]
        };

        bookvchart.options = {
            //"title": "",
            "isStacked": "true",
            "fill": 20,
            //"displayExactValues": true,
            "vAxis": {
                //"title": "",
                "gridlines": {"count": 0}
            },
            "hAxis": {
                "title": "Bookvalue ($)"
            }
        };

        bookvchart.formatters = {};

        // Show the top 3 + the current user + other
        luncherstat.getData().then(function (rows) {
            var k,
                top = 3,
                other = {name: 'Other', fund_contrib: 0.0};

            // Sort according to fund contribution in desc order
            rows.sort(function (a, b) {
                return b.total_fund_contrib - a.total_fund_contrib;
            });
            for (k = 0; k < rows.length; k += 1) {
                if (k < top || rows[k].luncher_id === loginUser.id) {
                    bookvchart.data.cols.push({
                        label: global.getLuncher(rows[k].luncher_id).username,
                        type: 'number'
                    });
                    bookvchart.data.rows[0].c.push({
                        v: rows[k].total_fund_contrib,
                        f: '$' + $filter('number')(rows[k].total_fund_contrib, 2)
                    });
                } else {
                    other.fund_contrib += rows[k].total_fund_contrib;
                }
                bookvchart.total += rows[k].total_fund_contrib;
            }
            bookvchart.data.cols.push({
                label: 'Others',
                type: 'number'
            });
            bookvchart.data.rows[0].c.push({
                v: other.fund_contrib,
                f: '$' + $filter('number')(other.fund_contrib, 2)
            });
        });

    }]);

}());