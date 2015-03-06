import angular from 'angular';
import 'angular-ui-router';

export default angular.module('ethiveSignupFailureRoute', [
        'ui.router'
    ])
	.controller('SignupFailureCtrl', ['$scope', '$state', function ($scope, $state) {
		$scope.reset = function () {
			// Only called from signup.failure
			$state.go('signup', {}, {reload: true});
		};
	}]);