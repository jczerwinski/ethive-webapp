import angular from 'angular';
import 'angular-ui-router';
// Used by ui-validate in template
import 'angular-ui-utils';
// Used in template
import 'ng-focus-on';
// Used in template on password directive
import user from 'models/user';

import accountTemplate from './account.html!text';

export default angular.module('ethiveAccountRoute', [
		'ui.router',
		'ui.utils',
		'focusOn',
		user.name
	])
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider.state('account', {
			url: '/account',
			template: accountTemplate,
			controller: ['$scope', '$state', 'focus', function ($scope, $state, focus) {
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