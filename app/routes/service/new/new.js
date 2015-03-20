import angular from 'angular';
import 'angular-ui-router';

import template from 'routes/service/new/new.html!text';

export default angular.module('ethiveNewServiceRoute', [
        'ui.router'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('service.newService', {
            url: '/new',
            template: template,
            controller: 'CreateServiceCtrl'
        });
    }])
    .controller('CreateServiceCtrl', ['$scope', '$stateParams', 'Service', '$state', function ($scope, $stateParams, Service, $state) {
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
    }]);