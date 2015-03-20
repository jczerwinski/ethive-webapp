import angular from 'angular';
import 'angular-ui-router';
import 'angular-bootstrap';

import NewOfferRoute from 'routes/provider/newOffer/newOffer';
import Provider from 'models/provider';

import providerTemplate from 'routes/provider/provider.html!text';
import newOfferTemplate from 'routes/provider/newOffer/newOffer.html!text';

var ID_REGEXP = /^[a-z0-9-]{1,}$/;

export default angular.module('ethiveProviderRoute', [
		'ui.router',
		'ui.bootstrap',
		Provider.name,
		NewOfferRoute.name
	])
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider.state('provider', {
			url: '/providers/:providerID',
			template: providerTemplate,
			resolve: {
				provider: ['Provider', '$stateParams', function (Provider, $stateParams) {
					return Provider.$find($stateParams.providerID).$asPromise();
				}]
			},
			controller: 'ProviderCtrl'
		});
	}])
	.controller('ProviderCtrl', ['$scope', '$stateParams', 'provider', '$rootScope', function ($scope, $stateParams, provider, $rootScope) {
		$scope.provider = provider;
		$rootScope.setTitle(provider.name);

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
			link: function (scope, elm, attrs, ctrl) {
				ctrl.$asyncValidators.uniqueProviderId = function (modelVal, viewVal) {
					return Provider.$find(modelVal || viewVal).$asPromise().then(function () {
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