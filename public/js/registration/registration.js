/*jslint node: true */
/*global angular */
"use strict";

(function () {
    var app = angular.module('registration', ['ui.bootstrap']);

    app.controller('RegController', [ '$scope', '$window', '$http', function ($scope, $window, $http) {
        $scope.email = $window.email;
        $scope.lunchers = $window.lunchers;
        $scope.selected = $scope.lunchers[0];

        $scope.register = function () {
            $http.put('/db/luncher/' + $scope.selected.id, {
                email : $scope.email
            }).success(function (data) {
                $window.location.href = "/";
            }).error(function (error, status) {
                $window.alert('Registration failed. (' + status + ') ' + JSON.stringify(error));
            });
        };
    }]);

}());