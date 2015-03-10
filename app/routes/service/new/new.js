import angular from 'angular';
import 'angular-ui-router';

export default angular.module('ethiveNewServiceRoute', [
        'ui.router'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('service.newService', {
            url: '/new',
            templateUrl: 'routes/service/new/new.html',
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