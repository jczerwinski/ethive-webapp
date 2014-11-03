'use strict';
angular.module('ethiveApp')
	.controller('SignupFailureCtrl', function ($scope, $state) {
		$scope.reset = function () {
			// Only called from signup.failure
			$state.go('signup', {}, {reload: true});
		};
	});