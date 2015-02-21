angular.module('ethiveApp')
    .directive('serviceselectorbutton', function($rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'views/service/serviceSelector/serviceSelectorButton.html',
            scope: {
                service: '=',
                display: '&'
            },
            controller: function($scope, $modal, $attrs) {
                var buttonScope = $scope;
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
                            $scope.display = buttonScope.display();
                        }
                    });
                    modalInstance.result.then(function(selectedService) {
                        $scope.service = selectedService;
                    });
                };
            }
        };
    })
    .directive('serviceselector', function() {
        return {
            restrict: 'E',
            controller: function($scope, Service) {
                $scope.services = Service.$search();
                var selectedElement = undefined;
                this.select = function(service, element) {
                    if (selectedElement) selectedElement.removeClass('selected');
                    $scope.selectedService = service;
                    selectedElement = element;
                    selectedElement.addClass('selected');
                };
                this.display = $scope.display();
            },
            template: '<serviceselectorlist services="services"></serviceselectorlist>',
            scope: {
                selectedService: '=service',
                display: '&'
            }
        };
    })
    .directive('serviceselectorlist', function() {
        return {
            restrict: 'E',
            scope: {
                services: '='
            },
            template: function (elem, attrs) {
                return '<ul><serviceselectornode ng-repeat="service in services" service="service"></serviceselectornode></ul>'
            }
        };
    })
    .directive('serviceselectornode', function($compile) {
        return {
            restrict: 'E',
            require: '^serviceselector', // Inject serviceselector controller into link.
            scope: {
                service: '='
            },
            templateUrl: 'views/service/serviceSelector/serviceSelectorNode.html',
            link: function(scope, element, attrs, serviceSelectorCtrl) {
                scope.select = function(service) {
                    return serviceSelectorCtrl.select(service, element);
                };

                scope.display = serviceSelectorCtrl.display(scope.service) || 'hide';
                
                var collectionSt = '<serviceselectorlist services="service.children"></serviceselectorlist>';
                if (angular.isArray(scope.service.children)) {
                    $compile(collectionSt)(scope, function(cloned) {
                        element.append(cloned);
                    });
                }

            }
        };
    });