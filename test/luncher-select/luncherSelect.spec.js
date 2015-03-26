'use strict';
/*global describe, it, beforeEach, inject, expect */

describe('LuncherController', function () {
    var ctrl,
        scope,
        property = {
            lunchers: [],
            attendee: []
        };

    beforeEach(module('luncherSelect', function ($provide) {
        $provide.value('global', {
            get: function (n) { return property[n]; }
        });
    }));

    beforeEach(inject(function ($controller, $rootScope) {
        //create an empty scope
        scope = $rootScope.$new();

        //declare the controller and inject our empty scope
        ctrl = $controller('LuncherController', {
            $scope: scope
        });
    }));

    // tests start here
    it('toggles attendee when no lunchers', function () {
        property.lunchers = [ ];
        property.attendee = [ ];

        expect(ctrl.isAttending('person1')).toBeFalsy();
        ctrl.toggle('person1');
        expect(ctrl.isAttending('person1')).toBeFalsy();
    });

    it('toggles attendee when 1 luncher', function () {
        property.lunchers = [ 'person1'];
        property.attendee = [ ];

        expect(ctrl.isAttending('person1')).toBeFalsy();
        ctrl.toggle('person1');
        expect(ctrl.isAttending('person1')).toBeTruthy();
        ctrl.toggle('person1');
        expect(ctrl.isAttending('person1')).toBeFalsy();
    });

    it('toggles incorrect attendee when 1 luncher', function () {
        property.lunchers = [ 'person1'];
        property.attendee = [ ];

        expect(ctrl.isAttending('person2')).toBeFalsy();
        ctrl.toggle('person2');
        expect(ctrl.isAttending('person2')).toBeFalsy();
    });

    it('toggles attendee when multiple lunchers', function () {
        property.lunchers = [ 'person1', 'person2', 'person3' ];
        property.attendee = [ 'person3'];

        expect(ctrl.isAttending('person1')).toBeFalsy();
        expect(ctrl.isAttending('person2')).toBeFalsy();
        expect(ctrl.isAttending('person3')).toBeTruthy();
        ctrl.toggle('person3');
        expect(ctrl.isAttending('person3')).toBeFalsy();
        expect(ctrl.isAttending('person1')).toBeFalsy();
        expect(ctrl.isAttending('person2')).toBeFalsy();
    });

});