import angular from 'angular';
import 'angular-ui-router';

import User from 'models/user';

export default angular.module('ethiveSignupRoute', [
		'ui.router',
		User.name
	])
	.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('signup', {
            url: '/signup',
            templateUrl: 'routes/signup/signup.html',
            controller: 'SignupCtrl'
        });
    }])
	.controller('SignupCtrl', ['$scope', 'User', '$state', '$rootScope', function ($scope, User, $state, $rootScope) {
		$rootScope.setTitle('Sign up for Ethive', true);
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