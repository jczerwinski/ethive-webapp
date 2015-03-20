import angular from 'angular';
import 'angular-ui-router';

import template from 'routes/service/edit/edit.html!text';

export default angular.module('ethiveEditServiceRoute', [
        'ui.router'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('service.editService', {
            url: '/edit',
            template: template,
            controller: 'EditServiceCtrl'
        });
    }])
    .controller('EditServiceCtrl', ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope) {
        $scope.forms = {};


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
            // Once parent changes again, set to valid by default.
            $scope.$watch('service.parent', function () {
                $scope.forms.editServiceForm.parent.$setValidity('cycle', true);
            });

            $scope.service.$save().$then(function (service) {
                return $state.go('service', {}, {
                    reload: true
                });
            }, function (error) {
                // Set parent to invalid if we try and create a cycle.
                function isCycleError(error) {
                    return error.errors &&
                        error.errors.parent &&
                        error.errors.parent.message === 'cycle';
                }
                if (isCycleError(error.$response.data)) {
                    $scope.forms.editServiceForm.parent.$setValidity('cycle', false);
                }
            });
        };

        $scope.cancel = function () {
            $scope.service.$restore();
            $state.go('^');
        };
    }]);