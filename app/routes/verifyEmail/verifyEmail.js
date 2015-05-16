import angular from 'angular';
import 'angular-ui-router';

import 'urish/angular-spinner';

import User from 'models/user';

import template from './verifyEmail.html!text';

export default angular.module('ethive.verifyEmail', [
		'angularSpinner',
		'ui.router',
		User.name
	])
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider.state('verifyEmail', {
				url: '/verifyEmail/:verificationKey',
				template: template,
				controller: ['$stateParams', '$state', 'User', function ($stateParams, $state, User) {
					var ctx = this;
					if ($stateParams.verificationKey) {
						ctx.status = 'verifying'
						User.verifyEmail($stateParams.verificationKey).then(function () {
							$state.go('login', {verified: true})
						}, function (resp) {
							if (resp.status === 404) {
								ctx.status = 'not-found';
							}
						});
					} else {
						ctx.status = 'not-found';
					}
				}],
				controllerAs: 'verifyEmailCtrl'
			});
	}]);