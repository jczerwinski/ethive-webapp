'use strict';

angular.module('ethiveApp')
    .controller('EditServiceCtrl', function($scope, $state, $rootScope) {
        $scope.options = {
            display: function (service) {
                // selectable services are administered by the user, published, and services -- not categories.
                function selectable(service) {
                    return service.isAdministeredBy($rootScope.user) && 
                    service.status === 'published' && 
                    service.type === 'service';
                }
                function hasSelectableDescendents (service) {
                    if (service.children) {
                        _.find(service.children, function (child) {
                            return selectable(child) || hasSelectableDescendents(child);
                        })
                    };
                    return false;
                }

                if (selectable(service)) {
                    return 'selectable';
                }
                if (hasSelectableDescendents(service)) {
                    return 'display';
                }
                return 'hidden';
            }
        };
        $scope.submit = function () {
            $scope.service.$save().$then(function (service) {
                return $state.go('service', {}, {reload: true});
            });
        };

        $scope.cancel = function () {
            $scope.service.$restore();
            $state.go('service');
        };
    });
