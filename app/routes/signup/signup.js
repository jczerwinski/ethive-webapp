import angular from 'angular';
import router from 'angular-ui-router';

import User from 'models/user';

export default angular.module('ethiveSignupRoute', [
		router.name,
		User.name
	])
	.controller('SignupCtrl', ['$scope', 'User', '$state', '$rootScope', function ($scope, User, $state, $rootScope) {
		$rootScope.setTitle('Sign up for Ethive');
		$scope.newUser = {};
		$scope.submit = function () {
			var user = User.$create({
				username: $scope.newUser.username,
				email: $scope.newUser.email,
				password: $scope.newUser.password
			}).$then(function(response) {
					$state.go('.success');
				}, function(error) {
					$state.go('.failure');
				});
		};
	}]);