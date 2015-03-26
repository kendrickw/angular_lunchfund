'use strict';
/*global describe, it, beforeEach, inject, expect */

describe('FundController', function () {
    var ctrl,
        scope,
        property = {
            attendee: []
        };

    beforeEach(module('fundForm', function ($provide) {
        $provide.value('global', {
            get: function (n) { return property[n]; }
        });
    }));

    beforeEach(inject(function ($controller, $rootScope) {
        //create an empty scope
        scope = $rootScope.$new();

        //declare the controller and inject our empty scope
        ctrl = $controller('FundController', {
            $scope: scope
        });
    }));

    // tests start here
    it('calculates lunchfund when there is no one', function () {
        property.attendee = [ ];

        expect(ctrl.getLunchfundAmount()).toBe(0);
    });

    it('calculates lunchfund when there is only one luncher', function () {
        property.attendee = [ 'person1' ];

        ctrl.billAmount = 10;
        expect(ctrl.getLunchfundAmount()).toBe(0);
        expect(ctrl.tipsAmount).toBe(1);
        expect(ctrl.eachPays).toBe(11);
    });

    it('calculates lunchfund when there are multiple lunchers', function () {
        property.attendee = [ 'person1', 'person2', 'person3' ];

        ctrl.billAmount = 52.44;
        expect(ctrl.getLunchfundAmount()).toBe(2);
        expect(ctrl.tipsAmount).toBe(5.56);
        expect(ctrl.eachPays).toBe(20);
    });

    it('calculates lunchfund when there are multiple lunchers and no tips', function () {
        property.attendee = [ 'person1', 'person2', 'person3' ];

        ctrl.billAmount = 52.44;
        ctrl.tipOffset = -5.56;
        expect(ctrl.getLunchfundAmount()).toBe(1.56);
        expect(ctrl.tipsAmount).toBe(0);
        expect(ctrl.eachPays).toBe(18);
    });

});