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
        $scope.options = {
            // display is used to determine whether and how to display services in the serviceSelector when selecting a new parent for this service.
            display: function (service) {
                var display = [];
                // A service is selectable as a parent if it is administered by the user and is a category -- not a service.
                function selectable(service) {
                        return service.isAdministeredBy($rootScope.user) &&
                            service.type === 'category';
                    }
                    // Categories are navigable -- no need to navigate into services, as they have no selectable children
                function navigable(service) {
                    return service.type === 'category';
                }
                if (selectable(service)) {
                    display.push('selectable');
                }
                if (navigable(service)) {
                    display.push('navigable');
                }
                return display.join(' ');
            }
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
            $state.go('service');
        };
    }]);