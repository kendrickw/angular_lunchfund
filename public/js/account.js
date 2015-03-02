/*jslint node: true */
/*global angular */
"use strict";

(function () {
    var app = angular.module('account', ['ui.bootstrap', 'ngAside']);

    app.controller('MainCtrl', function($scope, $aside) {
    $scope.openAside = function(position) {
      $aside.open({
        templateUrl: 'templates/aside.html',
        placement: position,
        size: 'sm',
        backdrop: false,
        controller: function($scope, $modalInstance) {
          $scope.ok = function(e) {
            $modalInstance.close();
            e.stopPropagation();
          };
          $scope.cancel = function(e) {
            $modalInstance.dismiss();
            e.stopPropagation();
          };
        }
      })
    }
    });

}());