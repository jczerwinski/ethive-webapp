'use strict';
angular.module('ethiveApp')
	.controller('SignupCtrl', function ($scope, $rootScope, User, $state) {
		$rootScope.title = 'Sign Up for Ethive';
		$scope.newUser = {};
		$scope.submit = function () {
			var user = new User({
				username: $scope.newUser.username,
				email: $scope.newUser.email,
				password: $scope.newUser.password
			});
			user.$save()
				.then(function(response) {
					$state.go('.success');
				})
				.catch(function(error) {
					$state.go('.failure');
				});
		};
	});