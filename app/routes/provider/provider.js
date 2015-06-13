import angular from 'angular';
import 'angular-ui-router';
import 'angular-bootstrap';

import 'chieffancypants/angular-hotkeys';

import newProviderTemplate from './new/new.html!text';
import editProviderTemplate from './editProvider/editProvider.html!text';

import NewOfferRoute from 'routes/provider/newOffer/newOffer';
import EditProviderRoute from './editProvider/editProvider';
import Provider from 'models/provider';

import providerTemplate from 'routes/provider/provider.html!text';
import newOfferTemplate from 'routes/provider/newOffer/newOffer.html!text';
import confirmDeleteTemplate from 'components/confirmDeleteModal/confirmDelete.html!text';

var ID_REGEXP = /^[a-z0-9-]{1,}$/;

export default angular.module('ethiveProviderRoute', [
		'ui.router',
		'ui.bootstrap',
		'cfp.hotkeys',
		Provider.name,
		NewOfferRoute.name,
		EditProviderRoute.name
	])
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider
		.state('provider', {
			url: '/providers',
			abstract: true,
			template: '<ui-view />'
		})
		.state('provider.new', {
			url: '/new',
			template: newProviderTemplate,
			controller: 'NewProviderCtrl'
		})
		.state('provider.existing', {
			url: '/:providerID',
			abstract: true,
			template: '<ui-view />',
			resolve: {
				provider: ['Provider', '$stateParams', function (Provider, $stateParams) {
					return Provider.$find($stateParams.providerID).$asPromise();
				}]
			}
		})
		.state('provider.existing.view', {
			url: '',
			template: providerTemplate,
			controller: 'ViewProviderCtrl'
		})
		.state('provider.existing.edit', {
			url: '/edit',
			template: editProviderTemplate,
			controller: 'EditProviderCtrl'
		});
	}])
	.controller('ViewProviderCtrl', ['$scope', '$stateParams', 'provider', '$modal', '$state', 'hotkeys', function ($scope, $stateParams, provider, $modal, $state, hotkeys) {
		hotkeys.bindTo($scope).add({
			combo: 'o',
			description: 'Create a new offer',
			callback: function () {
				$state.go('^.newOffer');
			}
		});
		$scope.provider = provider;
		$scope.setTitle(provider.name);
		$scope.deleteProvider = function (size) {
			$modal.open({
				template: confirmDeleteTemplate,
				controller: ['provider', '$scope', function (provider, $scope) {
					$scope.name = provider.name;
				}],
				//size: size,
				resolve: {
					provider: function () {
						return $scope.provider;
					}
				}
			}).result.then(function() {
				// Delete
				return provider.$destroy().$asPromise();
			}).then(function () {
				$state.go('account');
			});
		};
		$scope.newOffer = function (size) {
			var modalInstance = $modal.open({
				template: newOfferTemplate,
				controller: 'NewOfferCtrl',
				//size: size,
				resolve: {
					provider: function () {
						return $scope.provider;
					},
					service: function () {
						return undefined;
					}
				}
			});
		};
	}])
	.directive('providerId', ['Provider', '$q', function (Provider, $q) {
		return {
			require: 'ngModel',
			link: function (scope, elm, attrs, ctrl) {
				ctrl.$validators.id = function (modelValue, viewValue) {
					return ID_REGEXP.test(modelValue || viewValue);
				};
			}
		};
	}])
	.directive('uniqueProviderId', ['Provider', '$q', function (Provider, $q) {
		return {
			require: 'ngModel',
			scope: {
				editProviderID: '@editProviderId'
			},
			link: function (scope, elm, attrs, ctrl) {
				ctrl.$asyncValidators.uniqueProviderId = function (modelVal, viewVal) {
					var id = modelVal || viewVal;
					// Allow providers to keep its existing ID
					if (scope.editProviderID === id) {
						return $q.when(true);
					}
					return Provider.$find(id).$asPromise().then(function () {
						return $q.reject('exists');
					}, function (resp) {
						// Only return true/valid on 404 -- any other error means we can't say for certain.
						if (resp.$response.status === 404) {
							return true;
						} else {
							return $q.reject('error');
						}
					});
				};
			}
		};
	}])
	.directive('existingProviderId', ['Provider', '$q', function (Provider, $q) {
		return {
			require: 'ngModel',
			link: function (scope, elm, attrs, ctrl) {
				ctrl.$asyncValidators.existingProviderId = function (modelVal, viewVal) {
					return Provider.$find(modelVal || viewVal).$asPromise();
				};
			}
		};
	}]);