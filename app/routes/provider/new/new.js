import angular from 'angular';
import 'angular-ui-router';

import Provider from 'models/provider';

export default angular.module('ethiveNewProviderRoute', [
		'ui.router',
		Provider.name
	])
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider.state('provider.newProvider', {
			url: '/new'
		});
	}])
	.controller('NewProviderCtrl', ['$scope', 'Provider', '$state', function($scope, Provider, $state) {
		// Initialize provider
		$scope.newProvider = Provider.$build({
			admins: [$scope.user.username]
		});

		$scope.submit = function (form) {
			form.validate = function () {
				 angular.forEach(form, function (field, key) {
					if (!key.match(/^\$/) && field.$validate) field.$validate();
				});
			};
			$scope.newProvider.$save().$then(function (response) {
				// provider creation success!
				// navigate to our new provider's page
				$state.go('provider.existing.view', {
					providerID: $scope.newProvider.id
				});
			}, function (response) {
				// Should only ever get here if theres a server-side validation error, which should always be checked on the client side. No need for an error message if this is the case. Get the client side right!
				form.validate();
			});
		};
	}]);