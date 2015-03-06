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
                            $scope.$watch('service', function (service) {
                                if (service !== undefined) {
                                    $scope.select(service);
                                }
                            });
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
                this.navigate = function navigate (service) {
                    service.$fetch().$then(function (service){
                        $scope.navigated = service;
                        $scope.services = [service.invert()];
                    });

                };
                this.isNavigated = function isNavigated (service) {
                    return $scope.navigated && $scope.navigated._id == service._id;
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
                scope.select = function select (service) {
                    return serviceSelectorCtrl.select(service, element);
                };

                scope.navigate = function navigate (service) {
                    serviceSelectorCtrl.navigate(service);
                };

                scope.isNavigated = function isNavigated (service) {
                    return serviceSelectorCtrl.isNavigated(service);
                };

                scope.display = serviceSelectorCtrl.display(scope.service);

                function displayChildren (service) {
                    var children = _.filter(service.children, function (service) {
                        return serviceSelectorCtrl.display(service) !== '';
                    });
                    return children.length === 0 ? false : children;
                }

                // Cases:
                //      We're on the navigated service. If it has displayable children, show them. If not, show a message stating such
                //      We're on any other service. Just show displayable children, if any.
                //      
                
                var collectionSt = '<serviceselectorlist services="service.children"></serviceselectorlist>';

                if (!displayChildren(scope.service) && scope.isNavigated(scope.service)) {
                    collectionSt = '<ul><li class="serviceSelectorNodeHeader" style="font-style: italic;">Sorry, this service has no selectable sub-services.</li></ul>';
                }

                if (angular.isArray(scope.service.children)) {
                    $compile(collectionSt)(scope, function(cloned) {
                        element.append(cloned);
                    });
                }

            }
        };
    });