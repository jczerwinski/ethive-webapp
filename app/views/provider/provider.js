'use strict';

var ID_REGEXP = /^[a-z0-9-]{1,}$/;

angular.module('ethiveApp')
	.controller('ProviderCtrl', function($scope, $stateParams, Provider, $modal, $rootScope) {
		$scope.provider = Provider.$find($stateParams.providerID);
		$scope.provider.$then(function (provider) {
			$rootScope.setTitle(provider.name + $rootScope.titleEnd);
		});
		$scope.newOffer = function(size) {
			var modalInstance = $modal.open({
				templateUrl: '/views/offer/new/new.html',
				controller: 'NewOfferCtrl',
				//size: size,
				resolve: {
                    provider: function() {
                        return $scope.provider;
                    },
                    service: function () {
                    	return undefined;
                    }
                }
			});
		};

		$scope.offerTable = function() {
			return {
				header: [{}]
			};
		};

	})
	.directive('offertable', function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				offers: '=offers'
			},
			templateUrl: 'views/publicProviderOfferTable.html'
		};
	})
	.factory('Provider', function(restmod) {
		return restmod.model('/api/providers').mix({
			offers: {hasMany: 'Offer'},
			isAdministeredBy: function isAdministeredBy (user) {
				return user && user._id && _.contains(this.admins, user._id);
			}
		});
	})
	.directive('providerId', function(Provider, $q) {
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				ctrl.$validators.id = function(modelValue, viewValue) {
					return ID_REGEXP.test(modelValue || viewValue);
				};
			}
		};
	})
	.directive('uniqueProviderId', function(Provider, $q) {
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				ctrl.$asyncValidators.uniqueProviderId = function(modelVal, viewVal) {
					return Provider.$find(modelVal || viewVal).$asPromise().then(function() {
						return $q.reject('exists');
					}, function(resp) {
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
	})
	.directive('existingProviderId', function(Provider, $q) {
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				ctrl.$asyncValidators.existingProviderId = function(modelVal, viewVal) {
					return Provider.$find(modelVal || viewVal).$asPromise();
				};
			}
		};
	});