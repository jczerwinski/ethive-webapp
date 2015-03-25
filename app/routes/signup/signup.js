import angular from 'angular';
import 'angular-ui-router';

import signupTemplate from 'routes/signup/signup.html!text';
import signupSuccessTemplate from 'routes/signup/signup.success.html!text';
import signupFailureTemplate from 'routes/signup/signup.failure.html!text';

import User from 'models/user';

export default angular.module('ethiveSignupRoute', [
		'ui.router',
		User.name
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
							$state.go('.success');
						}, function (error) {
							$state.go('.failure');
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
			})
			.state('signup.failure', {
				url: '/failure',
				template: signupFailureTemplate,
				controller: ['$scope', '$state', function ($scope, $state) {
					$scope.setTitle('Sign up failure');
					$scope.reset = function () {
						// Only called from signup.failure
						$state.go('signup', {}, {
							reload: true
						});
					};
				}]
			});
	}]);