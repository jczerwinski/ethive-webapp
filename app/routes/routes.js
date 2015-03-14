import angular from 'angular';
import 'angular-ui-router';

import homeRoute from 'routes/home/home';
import serviceRoute from 'routes/service/service';
import newServiceRoute from 'routes/service/new/new';
import editServiceRoute from 'routes/service/edit/edit';
import providerRoute from 'routes/provider/provider';
import newProviderRoute from 'routes/provider/new/new';
import offerRoute from 'routes/offer/offer';
import loginRoute from 'routes/login/login';
import signupRoute from 'routes/signup/signup';
import signupFailureRoute from 'routes/signup/signup.failure';
import accountRoute from 'routes/account/account';

export default angular.module('ethiveRoutes', [
		'ui.router',
		homeRoute.name,
		serviceRoute.name,
		newServiceRoute.name,
		editServiceRoute.name,
		providerRoute.name,
		newProviderRoute.name,
		offerRoute.name,
		loginRoute.name,
		signupRoute.name,
		signupFailureRoute.name,
		accountRoute.name
	])
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider
			.state('signup.success', {
				url: '/success',
				templateUrl: 'routes/signup/signup.success.html'
			})
			.state('signup.failure', {
				url: '/failure',
				templateUrl: 'routes/signup/signup.failure.html',
				controller: 'SignupFailureCtrl'
			})
			.state('verifyEmailSuccess', {
				url: '/verifyEmailSuccess',
				templateUrl: 'routes/verifyEmail/verifyEmailSuccess.html'
			})
			.state('verifyEmailFailure', {
				url: '/verifyEmailFailure',
				templateUrl: 'routes/verifyEmail/verifyEmailFailure.html'
			})
			.state('otherwise', {
				url: '*path',
				templateUrl: 'routes/not-found/not-found.html',
				controller: ['$rootScope', function ($rootScope) {
					$rootScope.setTitle('Not found');
				}]
			});
	}]).run([
		'$rootScope', '$state',
		function ($rootScope, $state) {
			$rootScope.$on('$stateChangeError', function $stateChangeError(event, toState, toParams, fromState, fromParams, error) {
				if (error.$response && error.$response.status && error.$response.status === 404) {
					$state.go('otherwise', {}, {
						location: false
					});
				}
				/*console.group();
				console.error('$stateChangeError', error);
				console.error(error.stack);
				console.info('event', event);
				console.info('toState', toState);
				console.info('toParams', toParams);
				console.info('fromState', fromState);
				console.info('fromParams', fromParams);
				console.groupEnd();*/
			});
		}
	]);