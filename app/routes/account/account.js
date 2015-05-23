import angular from 'angular';
import 'angular-ui-router';
import 'angular-ui-utils';
import 'ng-focus-on';

import user from 'models/user';

import accountTemplate from 'routes/account/account.html!text';
import newProviderTemplate from 'routes/provider/new/new.html!text';

export default angular.module('ethiveAccountRoute', [
		'ui.router',
		'ui.utils',
		'focusOn',
		user.name // For password directive
	])
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider.state('account', {
			url: '/account',
			template: accountTemplate,
			controller: ['$scope', function ($scope) {
				$scope.setTitle('Your account');
				$scope.user.$refresh();
				$scope.passwords = {};
				$scope.changePassword = function (form) {
					$scope.user.changePassword($scope.passwords).then(function (resp) {
					}, function(error) {
						if (error.status === 403) {
							form.currentPassword.$setValidity('incorrect', false);
							focus('currentPassword');
						}

						if (error.data) {
							if (error.data.message === 'password') {
								$scope.status = 'password';
							} else if (error.data.message === 'brute') {
								$scope.status = 'brute';
							}
						} else {
							throw error;
						}
					});
				};
			}]
		});
	}]);