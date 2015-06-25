import angular from 'angular';
import 'angular-ui-router';
import 'ng-focus-on';

import selectOnFocus from 'components/selectOnFocus/selectOnFocus';
import template from 'routes/login/login.html!text';

export default angular.module('ethiveLoginRoute', [
		'ui.router',
		'focusOn',
		selectOnFocus.name
	])
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider.state('login', {
			url: '/login?verified',
			template: template,
			controller: ['$scope', '$state', '$stateParams', 'focus', function($scope, $state, $stateParams, focus) {
				$scope.setTitle('Log in to ethive', true);
				$scope.verified = !!$stateParams.verified;
				$scope.credentials = {};
				$scope.submit = function() {
					$scope.status = 'pending'; // Block 'already logged in error messages'
					$scope.login($scope.credentials, $scope.remember).then(function () {
						$scope.status = 'success'; // Block 'already logged in' error message.
						return $state.go('home', {}, {reload: true}).then(function () {
							$scope.status = '';
						});
						//TODO better. Either go to the most recent page, or go to a redirect. see https://github.com/angular-ui/ui-router/issues/92
					})
					.catch(function(error) {
						if (error.data) {
							if (error.data.message === 'password') {
								$scope.status = 'password';
								focus('password');
							} else if (error.data.message === 'user') {
								$scope.status = 'user';
								focus('username');
							} else if (error.data.message === 'unverified') {
								$scope.status = 'unverified';
							} else if (error.data.message === 'brute') {
								$scope.status = 'brute';
							}
						} else {
							// Something is wrong with the server.
							$scope.status = 'error';
						}
					});
				};
			}]
		});
	}]);