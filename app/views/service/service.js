'use strict';
var SERVICEID_REGEXP = /^[a-z0-9-]{1,}$/;
angular.module('ethiveApp')
    .factory('Service', function(restmod) {
        return restmod.model('/api/services').mix({
            hasAncestor: function(ancestor) {
                if (this.parent) {
                    if (this.parent._id === (ancestor._id || ancestor)) {
                        return true
                    }
                    return this.parent.hasAncestor(ancestor);
                } else {
                    return false;
                }
            },
            userIsAdmin: function() {
                return !!this.admins;
            }
        });
    })
    .controller('ServiceCtrl', function($scope, $stateParams, Service) {
        $scope.service = Service.$find($stateParams.serviceID);
    })
    .directive('uniqueServiceId', function(Service) {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                function uniqueIDValidator(id) {
                    if (id) {
                        Service.$find(id)
                            .$then(function(service) {
                                ctrl.$setValidity('uniqueServiceId', false);
                            }, function(error) {
                                if (error.$response.status === 404) {
                                    ctrl.$setValidity('uniqueServiceId', true);
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
    })
    .directive('existingServiceId', function(Service) {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                function existingIDValidator(id) {
                    if (id) {
                        Service.$find(id)
                            .$then(function(service) {
                                // Test for cycle.
                                if (service.hasAncestor(scope.service)) {
                                    ctrl.$setValidity('cycle', false);
                                } else {
                                    ctrl.$setValidity('cycle', true);
                                }
                                ctrl.$setValidity('existingServiceId', true);
                            }, function(error) {
                                if (error.$response.status === 404) {
                                    ctrl.$setValidity('existingServiceId', false);
                                    ctrl.$setValidity('cycle', true);
                                }
                            });
                    } else {
                        ctrl.$setValidity('existingServiceId', true);
                        ctrl.$setValidity('cycle', true);
                    }
                    return id;
                }
                ctrl.$parsers.push(existingIDValidator);
            }
        };
    })
    .directive('serviceId', function() {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
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