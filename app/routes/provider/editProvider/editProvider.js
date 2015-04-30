import angular from 'angular';
import 'angular-ui-router';
import 'angular-bootstrap';

export default angular.module('ethiveEditProviderRoute', [
		'ui.router',
		'ui.bootstrap'
	])
	.controller('EditProviderCtrl', ['$scope', '$state', 'provider', function ($scope, $state, provider) {
		$scope.provider = provider;
		$scope.setTitle('Editing ' + provider.name);
		$scope.cancel = function () {
			provider.$restore();
			$state.go('^.view');
		};
		$scope.save = function () {
			provider.$save().$then(function () {
				$state.go('^.view', {providerID: provider.id});
			});
		};
	}]);