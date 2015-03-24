/*jslint node: true */
/*global angular, $ */
"use strict";

(function () {
    var app = angular.module('fundFactory', []);

    // Get information about lunchers from DB
    app.factory('luncherstat', [ '$http', '$q', function ($http, $q) {
        // SQL request returns an array with entries like:
        // {"luncher_id":1,"total_meal_cost":1038.297422,"total_fund_contrib":113.815374,"meal_count": 232}
        var lsdef = $q.defer();

        $http.get('/db/luncherstat').success(function (data) {
            lsdef.resolve(data);
        }).error(function (error) {
            lsdef.reject(error);
        });

        function getData() {
            var def = $q.defer(),
                copy = [];

            lsdef.promise.then(function (data) {
                angular.copy(data, copy);
                def.resolve(copy);
            });

            return def.promise;
        }

        return {
            getData: getData
        };
    }]);

    // Get stock watchlist
    app.factory('getstocklist', [ '$http', '$q', function ($http, $q) {

        function getData() {
            var def = $q.defer();

            $http.get('/db/stock').success(function (data) {
                def.resolve(data);
            }).error(function (error) {
                console.error(error);
                def.reject("Unable to retrieve stock data from YAHOO.");
            });

            return def.promise;
        }

        return {
            getData: getData
        };
    }]);

    // Get the current stock info
    // Uses Yahoo Query Language, for details, see: https://developer.yahoo.com/yql/
    app.factory('stockstat', [ '$http', '$q', function ($http, $q) {

        // Ask google for stock price
        // This is a fallback mechanism if Yahoo fails.
        // Google Finance APIs have been officially deprecated. Who knows when this
        // API will stop working?
        // We are keeping this here because google API can get data for some
        // mutual funds like the Tangerine Equity and Yahoo can't.
        // 'entry' is the symbol object from yahoo query.
        // This query API will update the yahoo query object directly.
        function getDataFromGoogle(entry) {
            var def = $q.defer(),
                symbol = entry.symbol;

            // Get rid of name after dot
            // i.e. F00000NNHK.TO --> F00000NNHK
            symbol = symbol.substr(0, symbol.lastIndexOf('.')) || symbol;

            /* // [ {
                 "id": "82418589682714" ,
                 "t" : "INI240" ,
                 "e" : "MUTF_CA" ,
                 "l" : "15.93" ,
                 "l_fix" : "15.93" ,
                 "l_cur" : "$15.93" ,
                 "s": "0" ,
                 "ltt":"4:30PM EDT" ,
                 "lt" : "Mar 20, 4:30PM EDT" ,
                 "lt_dts" : "2015-03-20T16:30:00Z" ,
                 "c" : "+0.01" ,
                 "c_fix" : "0.01" ,
                 "cp" : "0.06" ,
                 "cp_fix" : "0.06" ,
                 "ccol" : "chg" ,
                 "pcls_fix" : "15.93" } ]
            */
            $http.get('http://www.google.com/finance/info', {
                params: {
                    q: symbol
                }
            }).success(function (data) {
                var result = angular.fromJson(data.substring(3));  // chop off double slash prefix
                entry.Ask = result[0].l;
                entry.Change = result[0].c;
                def.resolve(result[0]);
            }).error(function (error) {
                console.error(error);
                def.reject("Unable to retrieve stock data from GOOGLE.");
            });

            return def.promise;
        }

        // symbol is array of stock symbols,
        // i.e. ['WAVX', 'GOOGLE']
        function getData(symbols) {
            var def = $q.defer(),
                symbolstr;

            // Create a string with list of symbols
            symbolstr = symbols.map(function (sym) {
                return "'" + sym + "'";
            }).join(',');

            $http.get('https://query.yahooapis.com/v1/public/yql', {
                params: {
                    q: 'select * from yahoo.finance.quotes where symbol in (' + symbolstr + ')',
                    format: 'json',
                    env: 'store://datatables.org/alltableswithkeys'
                }
            }).success(function (data) {
                var promises = [];

                // Check if any of the returned data contains empty info
                // If so, try to get the quote from GOOGLE
                if (data.query.count === 1) {
                    if (data.query.results.quote.Ask === null) {
                        promises.push(getDataFromGoogle(data.query.results.quote));
                    }
                } else {
                    angular.forEach(data.query.results.quote, function (entry) {
                        if (entry.Ask === null) {
                            promises.push(getDataFromGoogle(entry));
                        }
                    });
                }

                $q.all(promises).then(function (results) {
                    def.resolve(data);
                }, function (error) {
                    def.reject(error);
                });
            }).error(function (error) {
                def.reject("Unable to retrieve stock data from YAHOO.");
            });

            // test data, so we don't have to bombard YAHOO server
            //var teststr = '{"query":{"count":2,"created":"2015-03-10T16:06:48Z","lang":"en-US","results":{"quote":[{"symbol":"CVM","Ask":"1.02","AverageDailyVolume":"586420","Bid":"1.01","AskRealtime":null,"BidRealtime":null,"BookValue":"0.13","Change_PercentChange":"-0.09 - -8.18%","Change":"-0.09","Commission":null,"Currency":"USD","ChangeRealtime":null,"AfterHoursChangeRealtime":null,"DividendShare":null,"LastTradeDate":"3/10/2015","TradeDate":null,"EarningsShare":"-0.46","ErrorIndicationreturnedforsymbolchangedinvalid":null,"EPSEstimateCurrentYear":"-0.40","EPSEstimateNextYear":"-0.36","EPSEstimateNextQuarter":"-0.10","DaysLow":"1.00","DaysHigh":"1.10","YearLow":"0.54","YearHigh":"1.90","HoldingsGainPercent":null,"AnnualizedGain":null,"HoldingsGain":null,"HoldingsGainPercentRealtime":null,"HoldingsGainRealtime":null,"MoreInfo":null,"OrderBookRealtime":null,"MarketCapitalization":"92.46M","MarketCapRealtime":null,"EBITDA":"-31.40M","ChangeFromYearLow":"0.47","PercentChangeFromYearLow":"+87.04%","LastTradeRealtimeWithTime":null,"ChangePercentRealtime":null,"ChangeFromYearHigh":"-0.89","PercebtChangeFromYearHigh":"-46.84%","LastTradeWithTime":"11:48am - <b>1.01</b>","LastTradePriceOnly":"1.01","HighLimit":null,"LowLimit":null,"DaysRange":"1.00 - 1.10","DaysRangeRealtime":null,"FiftydayMovingAverage":"0.85","TwoHundreddayMovingAverage":"0.77","ChangeFromTwoHundreddayMovingAverage":"0.24","PercentChangeFromTwoHundreddayMovingAverage":"+31.31%","ChangeFromFiftydayMovingAverage":"0.16","PercentChangeFromFiftydayMovingAverage":"+19.36%","Name":"Cel-Sci Corporation Common Stoc","Notes":null,"Open":"1.10","PreviousClose":"1.10","PricePaid":null,"ChangeinPercent":"-8.18%","PriceSales":"349.97","PriceBook":"8.53","ExDividendDate":null,"PERatio":null,"DividendPayDate":null,"PERatioRealtime":null,"PEGRatio":"0.00","PriceEPSEstimateCurrentYear":null,"PriceEPSEstimateNextYear":null,"Symbol":"CVM","SharesOwned":null,"ShortRatio":"3.50","LastTradeTime":"11:48am","TickerTrend":null,"OneyrTargetPrice":"4.50","Volume":"200516","HoldingsValue":null,"HoldingsValueRealtime":null,"YearRange":"0.54 - 1.90","DaysValueChange":null,"DaysValueChangeRealtime":null,"StockExchange":"ASE","DividendYield":null,"PercentChange":"-8.18%"},{"symbol":"LULU","Ask":"62.270","AverageDailyVolume":"2720320","Bid":"62.230","AskRealtime":null,"BidRealtime":null,"BookValue":"7.626","Change_PercentChange":"+0.012 - +0.019%","Change":"+0.012","Commission":null,"Currency":"USD","ChangeRealtime":null,"AfterHoursChangeRealtime":null,"DividendShare":null,"LastTradeDate":"3/10/2015","TradeDate":null,"EarningsShare":"1.633","ErrorIndicationreturnedforsymbolchangedinvalid":null,"EPSEstimateCurrentYear":"1.840","EPSEstimateNextYear":"2.080","EPSEstimateNextQuarter":"0.390","DaysLow":"61.600","DaysHigh":"62.588","YearLow":"36.260","YearHigh":"68.990","HoldingsGainPercent":null,"AnnualizedGain":null,"HoldingsGain":null,"HoldingsGainPercentRealtime":null,"HoldingsGainRealtime":null,"MoreInfo":null,"OrderBookRealtime":null,"MarketCapitalization":"8.84B","MarketCapRealtime":null,"EBITDA":"427.05M","ChangeFromYearLow":"25.992","PercentChangeFromYearLow":"+71.682%","LastTradeRealtimeWithTime":null,"ChangePercentRealtime":null,"ChangeFromYearHigh":"-6.738","PercebtChangeFromYearHigh":"-9.767%","LastTradeWithTime":"11:51am - <b>62.252</b>","LastTradePriceOnly":"62.252","HighLimit":null,"LowLimit":null,"DaysRange":"61.600 - 62.588","DaysRangeRealtime":null,"FiftydayMovingAverage":"65.735","TwoHundreddayMovingAverage":"50.985","ChangeFromTwoHundreddayMovingAverage":"11.267","PercentChangeFromTwoHundreddayMovingAverage":"+22.100%","ChangeFromFiftydayMovingAverage":"-3.483","PercentChangeFromFiftydayMovingAverage":"-5.299%","Name":"lululemon athletica inc.","Notes":null,"Open":"62.160","PreviousClose":"62.240","PricePaid":null,"ChangeinPercent":"+0.019%","PriceSales":"5.151","PriceBook":"8.162","ExDividendDate":null,"PERatio":"38.121","DividendPayDate":null,"PERatioRealtime":null,"PEGRatio":"2.070","PriceEPSEstimateCurrentYear":"33.833","PriceEPSEstimateNextYear":"29.929","Symbol":"LULU","SharesOwned":null,"ShortRatio":"7.100","LastTradeTime":"11:51am","TickerTrend":null,"OneyrTargetPrice":"62.880","Volume":"606916","HoldingsValue":null,"HoldingsValueRealtime":null,"YearRange":"36.260 - 68.990","DaysValueChange":null,"DaysValueChangeRealtime":null,"StockExchange":"NMS","DividendYield":null,"PercentChange":"+0.019%"}]}}}';
            //var teststr = '{"query":{"count":1,"created":"2015-03-18T18:55:43Z","lang":"en-US","results":{"quote":{"symbol":"LULU","Ask":"64.520","AverageDailyVolume":"2136510","Bid":"64.510","AskRealtime":null,"BidRealtime":null,"BookValue":"7.626","Change_PercentChange":"+0.102 - +0.158%","Change":"-0.102","Commission":null,"Currency":"USD","ChangeRealtime":null,"AfterHoursChangeRealtime":null,"DividendShare":null,"LastTradeDate":"3/18/2015","TradeDate":null,"EarningsShare":"1.633","ErrorIndicationreturnedforsymbolchangedinvalid":null,"EPSEstimateCurrentYear":"1.820","EPSEstimateNextYear":"2.070","EPSEstimateNextQuarter":"0.390","DaysLow":"63.432","DaysHigh":"64.560","YearLow":"36.260","YearHigh":"68.990","HoldingsGainPercent":null,"AnnualizedGain":null,"HoldingsGain":null,"HoldingsGainPercentRealtime":null,"HoldingsGainRealtime":null,"MoreInfo":null,"OrderBookRealtime":null,"MarketCapitalization":"9.16B","MarketCapRealtime":null,"EBITDA":"427.05M","ChangeFromYearLow":"28.262","PercentChangeFromYearLow":"+77.943%","LastTradeRealtimeWithTime":null,"ChangePercentRealtime":null,"ChangeFromYearHigh":"-4.468","PercebtChangeFromYearHigh":"-6.476%","LastTradeWithTime":"2:40pm - <b>64.522</b>","LastTradePriceOnly":"64.522","HighLimit":null,"LowLimit":null,"DaysRange":"63.432 - 64.560","DaysRangeRealtime":null,"FiftydayMovingAverage":"65.449","TwoHundreddayMovingAverage":"51.965","ChangeFromTwoHundreddayMovingAverage":"12.557","PercentChangeFromTwoHundreddayMovingAverage":"+24.164%","ChangeFromFiftydayMovingAverage":"-0.927","PercentChangeFromFiftydayMovingAverage":"-1.417%","Name":"lululemon athletica inc.","Notes":null,"Open":"64.400","PreviousClose":"64.420","PricePaid":null,"ChangeinPercent":"+0.158%","PriceSales":"5.331","PriceBook":"8.447","ExDividendDate":null,"PERatio":"39.511","DividendPayDate":null,"PERatioRealtime":null,"PEGRatio":"2.140","PriceEPSEstimateCurrentYear":"35.452","PriceEPSEstimateNextYear":"31.170","Symbol":"LULU","SharesOwned":null,"ShortRatio":"9.600","LastTradeTime":"2:40pm","TickerTrend":null,"OneyrTargetPrice":"63.340","Volume":"846751","HoldingsValue":null,"HoldingsValueRealtime":null,"YearRange":"36.260 - 68.990","DaysValueChange":null,"DaysValueChangeRealtime":null,"StockExchange":"NMS","DividendYield":null,"PercentChange":"+0.158%"}}}}';
            //def.resolve(JSON.parse(teststr));

            return def.promise;
        }

        return {
            getData: getData
        };
    }]);

}());