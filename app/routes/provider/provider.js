import angular from 'angular';
import 'angular-ui-router';
import 'angular-bootstrap';

import 'chieffancypants/angular-hotkeys';

import editNewTemplate from './editNew.html!text';

import Provider from 'models/provider';

import viewTemplate from './view.html!text';
import confirmDeleteTemplate from 'components/confirmDeleteModal/confirmDelete.html!text';

var ID_REGEXP = /^[a-z0-9-]{1,}$/;

export default angular.module('ethiveProviderRoute', [
		'ui.router',
		'ui.bootstrap',
		'cfp.hotkeys',
		Provider.name
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
			template: editNewTemplate,
			controller: ['$scope', 'Provider', '$state', 'hotkeys', function($scope, Provider, $state, hotkeys) {
				hotkeys.bindTo($scope).add({
					combo: 'esc',
					description: 'Cancel create new provider',
					callback: function (event) {
						event.preventDefault();
						$state.go('account');
					},
					allowIn: ['INPUT']
				});
				$scope.new = true;
				// Initialize provider
				$scope.provider = Provider.$cached({
					admins: [$scope.user.username]
				});

				$scope.submit = function (form) {
					form.validate = function () {
						 angular.forEach(form, function (field, key) {
							if (!key.match(/^\$/) && field.$validate) field.$validate();
						});
					};
					$scope.provider.$save().$then(function (provider) {
						// provider creation success!
						// navigate to our new provider's page
						$state.go('^.existing.view', {
							provider: provider
						});
						Provider.$clearCached();
					}, function (response) {
						// Should only ever get here if theres a server-side validation error, which should always be checked on the client side. No need for an error message if this is the case. Get the client side right!
						form.validate();
					});
				};

				$scope.cancel = function () {
					$state.go('account');
				};
			}]
		})
		.state('provider.existing', {
			url: '/:providerID',
			params: {
				provider: null
			},
			abstract: true,
			template: '<ui-view />',
			resolve: {
				provider: ['Provider', '$stateParams', function (Provider, $stateParams) {
					if ($stateParams.provider) {
						return $stateParams.provider;
					}
					if ($stateParams.providerID) {
						return Provider.$find($stateParams.providerID).$asPromise();
					}
				}]
			}
		})
		.state('provider.existing.view', {
			url: '',
			template: viewTemplate,
			controller: ['$scope', 'provider', '$modal', '$state', 'hotkeys', function ($scope, provider, $modal, $state, hotkeys) {
				hotkeys.bindTo($scope).add({
					combo: 'o',
					description: 'Create a new offer',
					callback: function (event) {
						event.preventDefault();
						$state.go('offer.new', {provider: provider});
					}
				}).add({
					combo: 'del',
					description: 'Delete this provider',
					callback: function (event) {
						event.preventDefault();
						$scope.deleteProvider();
					}
				}).add({
					combo: 'e',
					description: 'Edit this provider',
					callback: function (event) {
						event.preventDefault();
						$state.go('^.edit');
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
			}]
		})
		.state('provider.existing.edit', {
			url: '/edit',
			template: editNewTemplate,
			controller: ['$scope', '$state', 'provider', 'hotkeys', function ($scope, $state, provider, hotkeys) {
				hotkeys.bindTo($scope).add({
					combo: 'esc',
					description: 'Cancel edit provider',
					callback: function (event) {
						event.preventDefault();
						$state.go('^.view');
					},
					allowIn: ['INPUT']
				});
				$scope.edit = true;
				$scope.provider = provider;
				$scope.setTitle('Editing ' + provider.name);
				$scope.cancel = function () {
					provider.$restore();
					$state.go('^.view');
				};
				$scope.save = function () {
					provider.$save().$then(function () {
						provider.$pk = provider.id;
						$state.go('^.view', {provider: provider, providerID: provider.id}, {reload: true});
					});
				};
			}]
		});
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
	/**
	 * Ensures that the ID bound to this element's ng-model does not yet exist. Allows for an exception to be made for this provider's existing ID.
	 */
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
	}]);
