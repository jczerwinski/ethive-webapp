import angular from 'angular';
import 'angular-restmod';
import 'angular-ui-router';
import _ from 'lodash';

import 'chieffancypants/angular-hotkeys';

import service from 'models/service';
import currency from 'components/currency/currency';
import serviceSelectorSearch from 'components/serviceSelectorSearch/serviceSelectorSearch';
// Directive used in template
import errors from 'components/errors/errors';

import viewTemplate from './view.html!text';
import editNewTemplate from './editNew.html!text';

// For delete service modal
import 'angular-bootstrap';
import confirmDeleteTemplate from 'components/confirmDeleteModal/confirmDelete.html!text';

var SERVICEID_REGEXP = /^[a-z0-9-]{1,}$/;
export default angular.module('ethiveServiceRoute', [
		'restmod',
		'ui.router',
		'cfp.hotkeys',
		'ui.bootstrap',
		currency.name, // for ethiveFx filter in template
		service.name,
		serviceSelectorSearch.name,
		errors.name
	])
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider.state('service', {
			url: '/services',
			abstract: true,
			template: '<ui-view />'
		})
		.state('service.new', {
			url: '/new?parentID',
			params: {
				parent: null
			},
			template: editNewTemplate,
			controller: ['$scope', '$state', 'Service', 'parent', 'hotkeys', function ($scope, $state, Service, parent, hotkeys) {
				$scope.new = true;
				hotkeys.bindTo($scope).add({
					combo: 'esc',
					description: 'Cancel create new service',
					callback: function (event) {
						event.preventDefault();
						$scope.cancel();
					},
					allowIn: ['INPUT']
				});
				$scope.service = Service.$cached();
				$scope.parent = parent;
				$scope.service.parent = parent;
				$scope.setTitle('Create New Service');
				$scope.serviceSelectorFilter = function (service) {
					return service.isAdministeredBy($scope.user) &&
						service.type === 'category'
				};
				$scope.submit = function () {
					$scope.service.$save().$then(function () {
						$state.go('^.existing.view', {
							service: $scope.service,
							serviceID: $scope.service.id
						});
						Service.$clearCached();
					});
				};
				$scope.cancel = function () {
					if (parent) {
						$state.go('^.existing.view', {
							service: parent,
							serviceID: parent.id
						}, {reload: true});
					} else {
						$state.go('home');
					}
				};
			}],
			resolve: {
				parent: ['Service', '$stateParams', function (Service, $stateParams) {
					if ($stateParams.parent) {
						$stateParams.parentID = $stateParams.parent.id;
						return $stateParams.parent;
					}
					if ($stateParams.parentID) {
						return Service.$find($stateParams.parentID).$asPromise();
					}
				}]
			}
		})
		.state('service.existing', {
			url: '/:serviceID',
			params: {
				service: null
			},
			abstract: true,
			template: '<ui-view />',
			resolve: {
				service: ['Service', '$stateParams', function (Service, $stateParams) {
					if ($stateParams.service) {
						return $stateParams.service;
					}
					if ($stateParams.serviceID) {
						return Service.$find($stateParams.serviceID).$asPromise();
					}
				}]
			}
		})
		.state('service.existing.view', {
			url: '',
			template: viewTemplate,
			controller: ['$scope', '$state', 'service', 'currency', '$filter', 'hotkeys', '$modal', function ($scope, $state, service, currency, $filter, hotkeys, $modal) {
				if (service.isAdministeredBy($scope.user)) {
					hotkeys.bindTo($scope).add({
						combo: 'e',
						description: 'Edit service',
						callback: function (event) {
							event.preventDefault();
							$state.go('^.edit');
						}
					});
					if (service.type === 'category') {
						hotkeys.bindTo($scope).add({
							combo: 's',
							description: 'Create new subservice',
							callback: function (event) {
								event.preventDefault();
								$state.go('^.^.new', {parent: service});
							}
						});
					}
					if (service.canDelete()) {
						hotkeys.bindTo($scope).add({
							combo: 'del',
							description: 'Delete service',
							callback: function (event) {
								event.preventDefault();
								$scope.delete();
							}
						});
					}
				}
				$scope.setTitle(service.name);
				$scope.service = service;
				$scope.currencies = currency.currencyList;
				$scope.changeCurrency = function () {
					if ($scope.user.isLoggedIn()) {
						$scope.user.$save(['preferences.currency']);
					}
				};
				// Offer sort function
				$scope.userPrice = function (offer) {
					return offer.priceIn($scope.user.preferences.currency);
				};
				$scope.delete = function () {
					$modal.open({
						template: confirmDeleteTemplate,
						controller: ['service', '$scope', function (service, $scope) {
							$scope.name = service.name;
						}],
						resolve: {
							service: function () {
								return $scope.service;
							}
						}
					}).result.then(function() {
						// Delete
						return service.$destroy().$asPromise();
					}).then(function () {
						$state.go('home');
					});
				};
			}]
		})
		.state('service.existing.edit', {
			url: '/edit',
			template: editNewTemplate,
			controller: ['$scope', '$state', 'service', 'hotkeys', function ($scope, $state, service, hotkeys) {
				hotkeys.bindTo($scope).add({
					combo: 'esc',
					description: 'Cancel edit service',
					callback: function (event) {
						event.preventDefault();
						$scope.cancel();
					},
					allowIn: ['INPUT']
				});
				$scope.edit = true;
				$scope.service = service;
				$scope.setTitle('Editing ' + service.name);
				$scope.forms = {};

				$scope.serviceSelectorFilter = function (service) {
					return service.isAdministeredBy($scope.user) &&
						service.type === 'category' &&
						!service.equals($scope.service) &&
						!service.hasAncestor($scope.service);
				};

				$scope.submit = function () {
					$scope.service.$save().$then(function () {
						service.$pk = service.id;
						return $state.go('^.view', {service: $scope.service, serviceID: $scope.service.id}, {
							reload: true
						});
					});
				};

				$scope.cancel = function () {
					$scope.service.$restore();
					$state.go('^.view');
				};
			}]
		})
	}])
	.directive('uniqueServiceId', ['Service', function (Service) {
		return {
			require: 'ngModel',
			scope: {
				allowId: '=uniqueServiceIdAllow'
			},
			link: function (scope, elm, attrs, ctrl) {
				function uniqueIDValidator(id) {
					if (id) {
						Service.$find(id)
							.$then(function (service) {
								if (scope.allowId && scope.allowId === id) {
									ctrl.$setValidity('uniqueServiceId', true);
								} else {
									ctrl.$setValidity('uniqueServiceId', false);
								}
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
				ctrl.$formatters.push(uniqueIDValidator);
			}
		};
	}])
	.directive('serviceId', [function () {
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
				ctrl.$formatters.push(serviceIDValidator);
			}
		};
	}]);
