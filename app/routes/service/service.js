import angular from 'angular';
import 'angular-restmod';
import 'angular-ui-router';

import currency from 'components/currency/currency';

import EditServiceRoute from './edit/edit';
import editServiceTemplate from './edit/edit.html!text';

import template from 'routes/service/service.html!text';

import newServiceTemplate from './new/new.html!text';
import NewServiceRoute from './new/new';

import service from 'models/service';

var SERVICEID_REGEXP = /^[a-z0-9-]{1,}$/;
export default angular.module('ethiveServiceRoute', [
		'restmod',
		'ui.router',
		currency.name, // for ethiveFx filter in template
		EditServiceRoute.name,
		service.name
	])
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider.state('service', {
			url: '/services',
			abstract: true,
			template: '<ui-view />'
		})
		.state('service.index', {
			url: '',
			template: '<h1>Service index... coming soon!</h1>'
		})
		.state('service.new', {
			url: '/new',
			template: newServiceTemplate,
			controller: 'NewServiceCtrl',
			resolve: {
				// To support using same ctrl as existing.new
				service: [function () {return false}]
			}
		})
		.state('service.existing', {
			url: '/:serviceID',
			abstract: true,
			template: '<ui-view />',
			resolve: {
				service: ['Service', '$stateParams', function (Service, $stateParams) {
					return Service.$find($stateParams.serviceID).$asPromise();
				}]
			}
		})
		.state('service.existing.view', {
			url: '',
			template: template,
			controller: ['$scope', 'service', 'currency', function ($scope, service, currency) {
				$scope.setTitle(service.name);
				$scope.service = service;
				$scope.currencies = currency.currencyList;
				$scope.changeCurrency = function () {
					if ($scope.user.isLoggedIn()) {
						$scope.user.$save(['preferences.currency']);
					}
				};
			}]
		})
		.state('service.existing.edit', {
			url: '/edit',
			template: editServiceTemplate,
			controller: 'EditServiceCtrl',
		})
		.state('service.existing.new', {
			url: '/new',
			template: newServiceTemplate,
			controller: 'NewServiceCtrl'
		})
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
			}
		};
	}]);