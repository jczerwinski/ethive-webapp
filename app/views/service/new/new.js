'use strict';

angular.module('ethiveApp')
    .controller('CreateServiceCtrl', function($scope, $stateParams, Service, $state) {
        var newService = {};
        newService.parent = $scope.service;
        $scope.newService = newService;
        $scope.submit = function () {
            var srv = Service.$create(newService).$then(function () {
                return $state.go('service', {
                    serviceID: newService._id
                });
            });
        };
    });
