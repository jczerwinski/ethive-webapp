'use strict';
var SERVICEID_REGEXP = /^[a-z0-9-]{1,}$/;
angular.module('ethiveApp')
    .factory('Service', function (restmod) {
        return restmod.model('/api/services').mix({
            $config: {
                primaryKey: '_id'
            },
            parent: {
                belongsTo: 'Service',
                key: 'parentId'
            },
            children: {
                belongsToMany: 'Service',
                key: 'childrenId'
            },
            $extend: {
                Record: {
                    hasAncestor: function (ancestor) {
                        if (this.parent) {
                            if (this.parent._id === (ancestor._id || ancestor)) {
                                return true
                            }
                            return this.parent.hasAncestor(ancestor);
                        } else {
                            return false;
                        }
                    },
                    isAdministeredBy: function (user) {
                        // Recursively check ancestors admins for user.
                        return (user &&
                                user._id &&
                                this.admins &&
                                _.contains(this.admins, user._id)) ||
                            (!!this.parent &&
                                this.parent.isAdministeredBy(user));
                    }
                }
            }
        });
    })
    .controller('ServiceCtrl', function ($scope, Service, $stateParams) {
        Service.$find($stateParams.serviceID).$then(function (service) {
            $scope.service = service;
        }, function (err) {
            if (err.$response.status === 404) {
                $scope.error = 404;
            }
        });
    })
    .directive('uniqueServiceId', function (Service) {
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
    })
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