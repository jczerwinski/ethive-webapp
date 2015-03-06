import angular from 'angular';
import router from 'angular-ui-router';

export default angular.module('ethiveNewServiceRoute', [
        router.name
    ])
    .controller('CreateServiceCtrl', ['$scope', '$stateParams', 'Service', '$state', function($scope, $stateParams, Service, $state) {
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