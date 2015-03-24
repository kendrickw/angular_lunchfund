/*jslint node: true */
/*global angular, $ */
"use strict";

(function () {
    var app = angular.module('currencyFormatter', []);

    /** A directive for formatting number in input field, so user don't have
        to type the decimal dot.  (mainly for iphone keypad, because it doesn't have '.')
        usage:
          <input type="text" currency-formatter/>
    **/
    app.directive('currencyFormatter', [ '$filter', function ($filter) {
        // Automatically place decimal point in string 'n'
        function autoDecimal(n) {
            if (!n) {
                return n;
            }

            var puredigits = n.replace(/\D/g, ''), //remove non-digits
                floatstr = (parseFloat(puredigits || 0) / 100).toString(),  // add decimal
                decpos = floatstr.indexOf(".");

            if (decpos === -1) {
                floatstr += ".00";
            } else if (decpos === floatstr.length - 2) {
                floatstr += "0";
            }
            return floatstr;
        }

        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    var transformedInput = autoDecimal(inputValue);
                    if (transformedInput !== inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    return transformedInput;
                });
                modelCtrl.$formatters.push(function (data) {
                    return $filter('number')(parseFloat(data), 2);
                });
            }
        };
    }]);
}());