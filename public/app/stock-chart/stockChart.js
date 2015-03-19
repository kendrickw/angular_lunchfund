/*jslint node: true */
/*global angular, $ */
"use strict";

(function () {
    var app = angular.module('stockChart', ['globalFactory', 'fundFactory']);

    app.directive('stockChart', function () {
        return {
            scope: {
                stocksymbol: '=symbol'
            },
            restrict: 'E',
            templateUrl: 'app/stock-chart/stock-chart.html',
            replace: true,
            controller: 'StockChartController',
            controllerAs: 'StockChartCtrl',
            link: function (scope, element, attrs, ctrl) {
                if (scope.stocksymbol) {
                    scope.getStockQuote();
                }
                scope.$watch('stocksymbol', function (newValue, oldValue) {
                    if (newValue) {
                        scope.getStockQuote();
                    }
                });
            }
        };
    });

    // getting stock chart
    // https://code.google.com/p/yahoo-finance-managed/wiki/miscapiImageDownload
    // s: symbol: 'LULU'
    // t: timespan: 1d, 5d, 3m, 6m, 1y, 2y, 5y, my(max)
    // q: type: l(line), b(bar), c(candle)
    // l: logrithmic scale: on, off
    // z: size: s(small), m(medium), l(large)
    // p: mday(Moving Average Indicator): specify number of days (i.e. 50)
    app.controller('StockChartController', [ 'stockstat', '$scope', '$filter', function (stockstat, $scope, $filter) {
        var me = this,
            baseurl = 'http://chart.finance.yahoo.com/z?q=l&l=off&p=m50,m200';

        angular.extend(me, {
            isValidSym: false,
            tabindex: 3,
            charts: [ {
                timespan: '1d',
                url: '&t=1d'
            }, {
                timespan: '5d',
                url: '&t=5d'
            }, {
                timespan: '3m',
                url: '&t=3m'
            }, {
                timespan: '6m',
                url: '&t=6m'
            }, {
                timespan: '1y',
                url: '&t=1y'
            }, {
                timespan: '2y',
                url: '&t=2y'
            }, {
                timespan: '5y',
                url: '&t=5y'
            }, {
                timespan: 'max',
                url: '&t=my'
            }]
        });

        function getStockChartSrc() {
            return baseurl + '&z=s&s=' + $scope.stocksymbol + me.charts[me.tabindex].url;
        }

        function getStockChartSrcset() {
            var url = baseurl + '&s=' + $scope.stocksymbol + me.charts[me.tabindex].url;
            return url + '&z=m 512w, ' +
                   url + '&z=l 800w';
        }

        function nexttab() {
            me.tabindex = Math.min(me.tabindex + 1, me.charts.length - 1);
        }

        function prevtab() {
            me.tabindex = Math.max(me.tabindex - 1, 0);
        }

        $scope.stock = {};
        $scope.getStockQuote = function () {
            stockstat.getData([ $scope.stocksymbol ]).then(function (data) {
                var created = data.query.created,   // time stat is collected
                    entry;
                if (data.query.count === 1) {
                    entry = data.query.results.quote;
                } else {
                    entry = data.query.results.quote[0];
                }
                if (entry.Ask === null) {
                    // Unable to retrieve useful information
                    $scope.stock.name = entry.Name;
                    $scope.stock.symbol = entry.symbol;
                    me.isValidSym = false;
                    return;
                }
                $scope.stock = {
                    name: entry.Name,
                    symbol: entry.symbol,
                    created: created,
                    askdisp: $filter('currency')(entry.Ask, entry.Currency + ' ', 2),
                    ask: entry.Ask,
                    change: $filter('number')(Math.abs(entry.Change), 2),
                    currency: entry.Currency,
                    open: $filter('number')(entry.Open, 2),
                    dayshigh: $filter('number')(entry.DaysHigh, 2),
                    dayslow: $filter('number')(entry.DaysLow, 2),
                    mktcap: entry.MarketCapitalization,
                    PEratio: entry.PERatio,
                    divyield: entry.DividendYield
                };
                if (entry.Change > 0) {
                    $scope.stock.changeicon = 'action:trending-up';
                    $scope.stock.changestyle = {
                        'color': 'green'
                    };
                } else {
                    $scope.stock.changeicon = 'action:trending-down';
                    $scope.stock.changestyle = {
                        'color': 'red'
                    };
                }
                me.isValidSym = true;
            });
        };

        angular.extend(me, {
            nexttab: nexttab,
            prevtab: prevtab,
            getStockChartSrc: getStockChartSrc,
            getStockChartSrcset: getStockChartSrcset
        });

    }]);

}());