import angular from 'angular';
import 'angular-ui-router';

export default angular.module('ethiveEditServiceRoute', [
        'ui.router'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('service.editService', {
            url: '/edit',
            templateUrl: 'routes/service/edit/edit.html',
            controller: 'EditServiceCtrl'
        });
    }])
    .controller('EditServiceCtrl', ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope) {
        $scope.serviceSelectorOptions = {
            // display is used to determine whether and how to display services in the serviceSelector when selecting a new parent for this service.
            navigable: function navigable(service) {
                return service.type === 'category';
            },
            selectable: function selectable(service) {
                return service.isAdministeredBy($rootScope.user) &&
                    service.type === 'category';
            },
        };
        $scope.submit = function () {
            $scope.service.$save().$then(function (service) {
                return $state.go('service', {}, {
                    reload: true
                });
            });
        };

        $scope.cancel = function () {
            $scope.service.$restore();
            $state.go('^');
        };
    }]);