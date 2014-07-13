'use strict';

angular.module('ethiveApp')
	.controller('ProviderCtrl', function($scope, $stateParams, $resource) {
		var Provider = $resource('/api/providers/' + $stateParams.providerID);
		$scope.provider = Provider.get();
	})
	.directive('offertable', function () {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				offers: '=offers'
			},
			templateUrl: 'views/publicProviderOfferTable.html'
		};
	});