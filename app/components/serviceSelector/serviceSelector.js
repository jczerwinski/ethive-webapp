import angular from 'angular';
import 'angular-bootstrap';
import _ from 'lodash';

import ServiceModel from 'models/service';

import Button from './serviceSelectorButton.html!text';
import Modal from './serviceSelectorModal.html!text';
import Node from './serviceSelectorNode.html!text';

export default angular.module('ethiveServiceSelector', [
	'ui.bootstrap.modal',
	ServiceModel.name
	])
	.directive('serviceselectorbutton', ['$rootScope', function($rootScope) {
		return {
			restrict: 'E',
			template: Button,
			scope: {
				service: '=ngModel',
				options: '&'
			},
			require: 'ngModel',
			link: function (scope, elem, attr, ctrl) {
				ctrl.$isEmpty = function (value) {
					return value === undefined;
				};
			},
			controller: ['$scope', '$modal', '$attrs', function($scope, $modal, $attrs) {
				var buttonScope = $scope;
				$scope.openServiceSelector = function() {
					var modalInstance = $modal.open({
						template: Modal,
						controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
							$scope.select = function(service) {
								$modalInstance.close(service);
							};
							$scope.cancel = function() {
								$modalInstance.dismiss();
							};
							$scope.selectNone = function () {
								$modalInstance.close();
							}
							$scope.$watch('service', function (service) {
								if (service !== undefined) {
									$scope.select(service);
								}
							});
							$scope.options = buttonScope.options();
						}]
					});
					modalInstance.result.then(function(selectedService) {
						$scope.service = selectedService;
					});
				};
			}]
		};
	}])
	.directive('serviceselector', [function() {
		return {
			restrict: 'E',
			controller: ['$scope', 'Service', function($scope, Service) {
				$scope.services = Service.$forest();

				var selectedElement = undefined;

				this.select = function(service, element) {
					if (selectedElement) selectedElement.removeClass('selected');
					$scope.selectedService = service;
					selectedElement = element;
					selectedElement.addClass('selected');
				};

				var navigated = undefined;

				this.navigate = function navigate (service) {
					// service.$fetch().
					Service.$find(service.id).$then(function (service){
						navigated = service;
						$scope.services = [service.invert()];
					});
				};

				this.isNavigated = function isNavigated (service) {
					return navigated ? navigated.id === service.id : false;
				};

				var options = $scope.options();

				this.isNavigable = options.navigable || function isNavigable () {
					return true;
				};

				this.isSelectable = options.selectable || function isSelectable () {
					return true;
				};
			}],
			template: '<serviceselectorlist services="services"></serviceselectorlist>',
			scope: {
				selectedService: '=service',
				options: '&'
			}
		};
	}])
	.directive('serviceselectorlist', [function() {
		return {
			restrict: 'E',
			scope: {
				services: '='
			},
			template: function (elem, attrs) {
				return '<ul><serviceselectornode ng-repeat="service in services" service="service"></serviceselectornode></ul>'
			}
		};
	}])
	.directive('serviceselectornode', ['$compile', function($compile) {
		return {
			restrict: 'E',
			require: '^serviceselector', // Inject serviceselector controller into link.
			scope: {
				service: '='
			},
			template: Node,
			link: function(scope, element, attrs, serviceSelectorCtrl) {
				scope.select = function select (service) {
					serviceSelectorCtrl.select(service, element);
				};

				scope.navigate = function navigate (service) {
					serviceSelectorCtrl.navigate(service);
				};

				scope.isNavigable = function isNavigable (service) {
					return serviceSelectorCtrl.isNavigable(service);
				};

				scope.isSelectable = function isSelectable (service) {
					return serviceSelectorCtrl.isSelectable(service);
				};

				scope.isNavigated = function isNavigated (service) {
					return serviceSelectorCtrl.isNavigated(service);
				};

				function displayChildren (service) {
					// Display children if at least one child is displayed -- ie. selectable or navigable
					return _.filter(service.children, function (service) {
						return scope.isNavigable(service) || scope.isSelectable(service);
					});
				};

				scope.displayChildren = displayChildren(scope.service);


				// Cases:
				//      We're on the navigated service. If it has displayable children, show them. If not, show a message stating such
				//      We're on any other service. Just show displayable children, if any.
				var collectionSt = '<serviceselectorlist services="displayChildren"></serviceselectorlist>';

				if (!displayChildren(scope.service).length && scope.isNavigated(scope.service)) {
					collectionSt = '<ul><li class="serviceSelectorNodeHeader" style="font-style: italic;">Sorry, this service has no selectable sub-services.</li></ul>';
				}

				// only compile if the service came with an array of children attached. if it did not, this implies that it is a child of the currently navigated service. these children will *not* have their descendents attached.
				if (angular.isArray(scope.service.children)) {
					$compile(collectionSt)(scope, function(cloned) {
						element.append(cloned);
					});
				}

			}
		};
	}]);