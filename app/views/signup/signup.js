'use strict';
angular.module('ethiveApp')
	.controller('SignupCtrl', function ($scope, User, $state, $rootScope) {
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
	});