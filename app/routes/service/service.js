import angular from 'angular';
import 'angular-restmod';
import 'angular-ui-router';

import service from 'models/service';

var SERVICEID_REGEXP = /^[a-z0-9-]{1,}$/;
export default angular.module('ethiveServiceRoute', [
        'restmod',
        'ui.router',
        service.name
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('service', {
            url: '/services/:serviceID',
            templateUrl: 'routes/service/service.html',
            controller: 'ServiceCtrl'
        })
    }])
    .controller('ServiceCtrl', ['$scope', 'Service', '$stateParams', function ($scope, Service, $stateParams) {
        Service.$find($stateParams.serviceID).$then(function (service) {
            $scope.service = service;
        }, function (err) {
            if (err.$response.status === 404) {
                $scope.error = 404;
            }
        });
    }])
    .directive('ethiveServiceAncestorsExclude', ['Service', function (Service) {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModelCtrl) {
                // TODO -- Validator that supports prevents the selection of cycles in service selector for edit service.
            }
        };
    }])
    .directive('uniqueServiceId', ['Service', function (Service) {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                function uniqueIDValidator(id) {
                    if (id) {
                        Service.$find(id)
                            .$then(function (service) {
                                ctrl.$setValidity('uniqueServiceId', false);
                            }, function (error) {
                                if (error.$response.status === 404) {
                                    ctrl.$setValidity('uniqueServiceId', true);
                                } else {
                                    // Anything else, including server error, is false.
                                    ctrl.$setValidity('uniqueServiceId', false);
                                }
                            });
                    } else {
                        ctrl.$setValidity('uniqueServiceId', true);
                    }
                    return id;
                }
                ctrl.$parsers.push(uniqueIDValidator);
            }
        };
    }])
    .directive('serviceId', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                function serviceIDValidator(id) {
                    if (SERVICEID_REGEXP.test(id)) {
                        // it is valid
                        ctrl.$setValidity('serviceId', true);
                        return id;
                    } else {
                        // it is invalid, return undefined (no model update)
                        ctrl.$setValidity('serviceId', false);
                        return undefined;
                    }
                }
                ctrl.$parsers.push(serviceIDValidator);
            }
        };
    });