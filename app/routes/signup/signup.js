import angular from 'angular';
import 'angular-ui-router';

// For ui-validate in template
import 'angular-ui-utils';

import signupTemplate from 'routes/signup/signup.html!text';
import signupSuccessTemplate from 'routes/signup/signup.success.html!text';

import User from 'models/user';

export default angular.module('ethiveSignupRoute', [
		'ui.router',
		User.name,
		'ui.utils'
	])
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider.state('signup', {
				url: '/signup',
				abstract: true,
				template: '<ui-view />'
			})
			.state('signup.default', {
				url: '',
				template: signupTemplate,
				controller: ['$scope', 'User', '$state', function ($scope, User, $state) {
					$scope.setTitle('Sign up for Ethive', true);
					$scope.newUser = {};
					$scope.submit = function () {
						var user = User.$create({
							username: $scope.newUser.username,
							email: $scope.newUser.email,
							password: $scope.newUser.password
						}).$then(function (response) {
							$state.go('signup.success');
						}, function (error) {
							$state.go('error.500');
						});
					};
				}]
			})
			.state('signup.success', {
				url: '/success',
				template: signupSuccessTemplate,
				controller: ['$scope', function ($scope) {
					$scope.setTitle('Sign up success');
				}]
			});
	}]);