import angular from 'angular';
import 'angular-ui-router';
import 'angular-bootstrap';

import Provider from 'models/provider';

var ID_REGEXP = /^[a-z0-9-]{1,}$/;

export default angular.module('ethiveProviderRoute', [
		'ui.router',
		'ui.bootstrap',
		Provider.name
	])
    .config(['$stateProvider', function ($stateProvider) {
	    $stateProvider.state('provider', {
            url: '/providers/:providerID',
            templateUrl: 'routes/provider/provider.html',
            controller: 'ProviderCtrl'
        });
	}])
	.controller('ProviderCtrl', ['$scope', '$stateParams', 'Provider', '$modal', '$rootScope', function($scope, $stateParams, Provider, $modal, $rootScope) {
		$scope.provider = Provider.$find($stateParams.providerID);
		$scope.provider.$then(function (provider) {
			$rootScope.setTitle(provider.name);
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

	}])
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
	.directive('providerId', ['Provider', '$q', function(Provider, $q) {
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				ctrl.$validators.id = function(modelValue, viewValue) {
					return ID_REGEXP.test(modelValue || viewValue);
				};
			}
		};
	}])
	.directive('uniqueProviderId', ['Provider', '$q', function(Provider, $q) {
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
	}])
	.directive('existingProviderId', ['Provider', '$q', function(Provider, $q) {
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				ctrl.$asyncValidators.existingProviderId = function(modelVal, viewVal) {
					return Provider.$find(modelVal || viewVal).$asPromise();
				};
			}
		};
	}]);