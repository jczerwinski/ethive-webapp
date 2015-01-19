angular.module('ethiveApp')
    .directive('serviceselectorbutton', function($rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'views/service/serviceSelector/serviceSelectorButton.html',
            require: '?ngModel',
            controller: function($scope, $modal, $attrs) {
                $scope.openServiceSelector = function() {
                    var modalInstance = $modal.open({
                        templateUrl: 'views/service/serviceSelector/serviceSelectorModal.html',
                        controller: function($scope, $modalInstance) {
                            $scope.select = function(service) {
                                $modalInstance.close(service);
                            };
                            $scope.cancel = function() {
                                $modalInstance.dismiss();
                            };
                            $scope.restrict = $attrs.restrict;
                        }
                    });
                    modalInstance.result.then(function(selectedService) {
                        $scope.service = selectedService;
                    });
                };
            },
            link: function (scope, elem, attrs, ngModelCtrl) {
                // Inspired by http://www.benlesh.com/2012/10/validating-custom-control-in-angular-js.html
                scope.$watch('service', function (value) {
                    ngModelCtrl.$setViewValue(value);
                });
                ngModelCtrl.$name = attrs.name;
            }
        };
    })
    .directive('serviceselector', function() {
        return {
            restrict: 'E',
            controller: function($scope, Service, $attrs) {
                $scope.services = Service.$search();
                var selectedElement = undefined;
                this.select = function(service, element) {
                    if (selectedElement) selectedElement.removeClass('selected');
                    $scope.selectedService = service;
                    selectedElement = element;
                    selectedElement.addClass('selected');
                };
            },
            template: '<serviceselectorlist services="services" restrict="{{restrict}}"></serviceselectorlist>',
            scope: {
                selectedService: '=service',
                restrict: '@'
            }
        };
    })
    .directive('serviceselectorlist', function() {
        return {
            restrict: 'E',
            scope: {
                services: '=',
                restrict: '@'
            },
            template: function (elem, attrs) {
                return '<ul><serviceselectornode ng-repeat="service in services" service="service" restrict="{{restrict}}"></serviceselectornode></ul>'
            }
        };
    })
    .directive('serviceselectornode', function($compile) {
        return {
            restrict: 'E',
            require: '^serviceselector', // Inject serviceselector controller into link.
            scope: {
                service: '=',
                restrict: '@'
            },
            template: function (elem, attrs) {
                return '<li ng-if="service.type !== restrict" class="serviceSelectorNodeHeader">{{service.name}}</li><li ng-if="service.type === restrict" class="serviceSelectorNodeHeader"><a href ng-click="select(service);">{{service.name}}</a></li>';
            },
            link: function(scope, element, attrs, serviceSelectorCtrl) {
                scope.select = function(service) {
                    return serviceSelectorCtrl.select(service, element);
                };
                var collectionSt = '<serviceselectorlist services="service.children" restrict="{{restrict}}"></serviceselectorlist>';
                if (angular.isArray(scope.service.children)) {
                    $compile(collectionSt)(scope, function(cloned) {
                        element.append(cloned);
                    });
                }

            }
        };
    });