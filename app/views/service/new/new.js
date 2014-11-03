'use strict';

angular.module('ethiveApp')
    .controller('CreateServiceCtrl', function($scope, $stateParams, $resource) {
        var Service = $resource('/api/services/' + $stateParams.serviceID);
        $scope.service = Service.get({}, function () {}, function (error) {
            console.log(error)
        });
        $scope.service.isAdministeredBy = function(user) {
            var servicesAdministered = user.servicesAdministered || [];
            return servicesAdministered.some(function(serviceID) {
                return this.isDescendantOf(serviceID);
            });
        };
        $scope.service.isDescedantOf = function(serviceID) {
            var ancestors = this.ancestors || [];
            return ancestors.some(function(ancestor) {
                return ancestor === serviceID;
            });
        };
    })
    .directive('uniqueID', function(Service) {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                function uniqueIDValidator(id) {
                    Service.get({
                        id: id
                    }).$promise
                        .then(function(service) {
                            ctrl.$setValidity('uniqueID', false);
                        })
                        .catch(function(error) {
                            ctrl.$setValidity('uniqueID', true);
                        });
                    return id;
                }
                ctrl.$parsers.push(uniqueIDValidator);
            }
        };
    })