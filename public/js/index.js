/*jslint node: true */
/*global angular, $, navigator */
"use strict";

(function () {
    var app = angular.module('index', ['ui.bootstrap', 'ui.router', 'ngCookies']);

    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        // For unmatched routes
        $urlRouterProvider.otherwise('/home');

        // Application routes
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'templates/home.html'
        }).state('dashboard', {
            url: '/dashboard',
            templateUrl: 'templates/dashboard.html'
        }).state('setting', {
            url: '/setting',
            templateUrl: 'templates/setting.html'
        });
    }]);

    // Service for storing and getting variables across controllers
    app.factory('global', [ '$window', function ($window) {
        var property = {
            locale: navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage),
            loginUser: $window.currentuser,
            attendee: [],
            nonattendee: [],
            events: []
        };

        return {
            get: function (field) {
                return property[field];
            },
            set: function (field, value) {
                property[field] = value;
            }
        };
    }]);

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

    app.controller('ProfileController', [ '$scope', 'global', function ($scope, global) {
        $scope.profileModel = {
            loginUser: function () { return global.get('loginUser'); }
        };
    }]);

    app.controller('LuncherController', [ '$scope', '$http', 'global', function ($scope, $http, global) {
        $scope.LuncherModel = {
            isCollapsed: true,
            attendee: function () { return global.get('attendee'); },
            nonattendee: function () { return global.get('nonattendee'); }
        };

        // Aliases to model
        var attendee = $scope.LuncherModel.attendee,
            nonattendee = $scope.LuncherModel.nonattendee,
            loginUser = function () { return global.get('loginUser'); };

        // Propagate lunchfund database entries
        $http.get('/db/lunchers').success(function (data) {
            var k;

            for (k = 0; k < data.length; k += 1) {
                // Place first 5 lunchers as default attendee
                if (k < 5) {
                    attendee().push(data[k]);
                } else {
                    nonattendee().push(data[k]);
                }

                // Identify current user based on information available in database record
                if (data[k].firstname === loginUser().firstname &&
                        data[k].lastname === loginUser().lastname) {
                    angular.extend(loginUser(), data[k]);
                }
            }
        });

        // Toggle user between attendee and nonattendee
        function toggleuser(user) {
            var idx = attendee().indexOf(user);
            if (idx !== -1) {
                attendee().splice(idx, 1);
                nonattendee().push(user);
            } else {
                idx = nonattendee().indexOf(user);
                nonattendee().splice(idx, 1);
                attendee().push(user);
            }
        }

        // Add functions to model
        angular.extend($scope.LuncherModel, {
            toggleuser: toggleuser
        });
    }]);

    app.controller('FundController', [ '$scope', '$http', 'global', function ($scope, $http, global) {
        $scope.FundModel = {
            billAmount: "",
            tipsAmount: 0,
            totalAmount: 0,
            lunchfundAmount: 0,
            eachPays: 0,
            totalCollected: 0,
            tipPercent: 10,
            fundholder: ""
        };

        var fm = $scope.FundModel,      // Aliases to model
            tipPercent = 10,            // Tip percentage
            attendee = function () { return global.get('attendee'); };

        function calcWhenBillChange() {
            if (!fm.billAmount) {
                return;
            }

            var numPerson = attendee().length;
            fm.totalAmount = Math.ceil(fm.billAmount * (1 + tipPercent / 100));
            fm.tipsAmount = fm.totalAmount - fm.billAmount;
            if (numPerson > 0) {
                fm.eachPays = Math.ceil(fm.totalAmount / numPerson);
            }
            fm.totalCollected = fm.eachPays * numPerson;
            fm.lunchfundAmount = fm.totalCollected - fm.totalAmount;
            fm.tipPercent = fm.tipsAmount / fm.billAmount * 100;
        }

        function calcWhenTipsChange() {
        }

        function calcWhenLunchfundChange() {
        }

        function submit() {
            var entry = {
                time: new Date(),
                bill: parseFloat(fm.billAmount),
                totalpaid: fm.totalAmount,
                fund: fm.lunchfundAmount,
                attendee: attendee(),
                fundholder: fm.fundholder,
                submitter: global.get('loginUser')
            };
            $http.post('db/event', entry).success(function (data) {
                // console.log('success');
                global.get('events').unshift(entry);
            }).error(function (error, status, headers, config) {
                alert(JSON.stringify(error));
            });
        }

        // Add functions to model
        angular.extend(fm, {
            calcWhenBillChange: calcWhenBillChange,
            calcWhenTipsChange: calcWhenTipsChange,
            calcWhenLunchfundChange: calcWhenLunchfundChange,
            submit: submit
        });
    }]);

    app.controller('EventController', [ '$scope', '$http', 'global', function ($scope, $http, global) {
        $scope.EventModel = {
            events: function () { return global.get('events'); }
        };

        var em = $scope.EventModel;

        // Get Past couple lunch events
        $http.get('/db/events', {
            params: {
                count: 2
            }
        }).success(function (data) {
            global.set('events', data);
        });

        function formatTime(time) {
            var date = new Date(time),
                locale = global.get('locale'),
                month = date.toLocaleString(locale, { month: "short" });
            return month + "-" + date.getDate();
        }

        // Add functions to model
        angular.extend(em, {
            formatTime: formatTime
        });
    }]);

    app.controller('MasterCtrl', ['$scope', '$window', '$cookieStore', function ($scope, $window, $cookieStore) {
        /**
         * Sidebar Toggle & Cookie Control
         */
        var mobileView = 992;

        $scope.getWidth = function () {
            return $window.innerWidth;
        };

        $scope.$watch($scope.getWidth, function (newValue, oldValue) {
            if (newValue >= mobileView) {
                if (angular.isDefined($cookieStore.get('toggle'))) {
                    $scope.toggle = !$cookieStore.get('toggle') ? false : true;
                } else {
                    $scope.toggle = true;
                }
            } else {
                $scope.toggle = false;
            }
        });

        $scope.toggleSidebar = function () {
            $scope.toggle = !$scope.toggle;
            $cookieStore.put('toggle', $scope.toggle);
        };

        $window.onresize = function () {
            $scope.$apply();
        };

        // Page selection control
        $scope.allPages = [ {
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
        $scope.currentPageID = 0;

        // Get current page info (optional input to specify page number)
        $scope.getPage = function (id) {
            var page = id || $scope.currentPageID;
            return $scope.allPages[page];
        };

        $scope.setPage = function (id) {
            $scope.currentPageID = id || 0;
        };

        // variables passed from node.js
        $scope.COPYRIGHT_TEXT = $window.COPYRIGHT_TEXT;

    }]);

}());