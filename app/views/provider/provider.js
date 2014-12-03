'use strict';

var ID_REGEXP = /^[a-z0-9-]{1,}$/;

angular.module('ethiveApp')
	.controller('ProviderCtrl', function($scope, $stateParams, $resource) {
		var Provider = $resource('/api/providers/' + $stateParams.providerID);
		$scope.provider = Provider.get();
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
		return restmod.model('/api/providers');
	})
	.directive('providerId', function(Provider, $q) {
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				ctrl.$validators.id = function(modelValue, viewValue) {
					return ID_REGEXP.test(modelValue || viewValue);
				};

				ctrl.$asyncValidators.uniqueProviderId = function(modelVal, viewVal) {
					return Provider.$find(modelVal || viewVal).$asPromise().then(function() {
						return $q.reject('exists');
					}, function() {
						return true;
					});
				};
			}
		};
	});