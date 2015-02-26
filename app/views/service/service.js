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
                        // admins array is only attached to server response if user is an admin
                        return !!this.admins;
                    },
                    /**
                     * Returns the root service of this service, with this service's ancestor tree on the `parent` attribute inverted onto the `children` attribute. Only this service's ancestors and children will be present in the tree.
                     */
                    invert: function () {
                        if (this.parent) {
                            this.parent.children = [this];
                            return this.parent.invert();
                        }
                        // We're at the root.
                        return this;
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
    .directive('ethiveServiceAncestorsExclude', function (Service) {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModelCtrl) {
                // TODO -- Validator that supports prevents the selection of cycles in service selector for edit service.
            }
        };
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