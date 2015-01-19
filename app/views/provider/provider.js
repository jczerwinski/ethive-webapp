'use strict';

var ID_REGEXP = /^[a-z0-9-]{1,}$/;

angular.module('ethiveApp')
	.controller('ProviderCtrl', function($scope, $stateParams, Provider, $modal) {
		$scope.provider = Provider.$find($stateParams.providerID);
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
			offers: {hasMany: 'Offer'}
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
					}, function() {
						return true;
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