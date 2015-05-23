import angular from 'angular';
import 'angular-ui-router';
import 'ng-focus-on';

import config from 'app-config';

import selectOnFocus from 'components/selectOnFocus/selectOnFocus';
import template from 'routes/login/login.html!text';

export default angular.module('ethiveLoginRoute', [
		'ui.router',
		'focusOn',
		selectOnFocus.name,
		config.name
	])
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider.state('login', {
			url: '/login?verified',
			template: template,
			controller: ['$scope', '$http', '$state', '$stateParams', 'focus', 'config', function($scope, $http, $state, $stateParams, focus, config) {
				$scope.setTitle('Log in to Ethive', true);
				$scope.verified = !!$stateParams.verified;
				$scope.submit = function() {
					// Try to authenticate
					// TODO HTTPS only.
					$http.post(config.apiRoot + '/auth', {
						username: $scope.username,
						password: $scope.password
					}).then(function(response) {
						$scope.status = 'success'; // Block 'already logged in' error message.
						response.data.remember = $scope.remember;
						$scope.setAuth(response.data);
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