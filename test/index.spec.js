'use strict';
/*global describe, it, beforeEach, inject, expect */

describe('MenuController', function () {
    var ctrl,
        scope,
        property = {
            loginUser: {
                email: 'mock@mock.com',
                firstname: 'John',
                lastname: 'Smith'
            }
        };

    beforeEach(module('index', function ($provide) {
        $provide.value('global', {
            get: function (n) { return property[n]; }
        });
    }));

    beforeEach(inject(function ($controller, $rootScope) {
        //create an empty scope
        scope = $rootScope.$new();

        //declare the controller and inject our empty scope
        ctrl = $controller('MenuController', {
            $scope: scope
        });
    }));

    // tests start here
    it('should have proper information in "userdetail"', function () {
        expect(ctrl.userdetail.length).toBe(3);

        expect(ctrl.userdetail[0].title).toBe('Email');
        expect(ctrl.userdetail[0].text).toBe(property.loginUser.email);

        expect(ctrl.userdetail[1].title).toBe('Firstname');
        expect(ctrl.userdetail[1].text).toBe(property.loginUser.firstname);

        expect(ctrl.userdetail[2].title).toBe('Lastname');
        expect(ctrl.userdetail[2].text).toBe(property.loginUser.lastname);
    });

});