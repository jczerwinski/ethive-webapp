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
import accountRoute from 'routes/account/account';
import verifyEmailRoute from 'routes/verifyEmail/verifyEmail';
import forProvidersRoute from 'routes/for-providers/for-providers';
import termsOfService from 'routes/terms-of-service/terms-of-service';
import refer from 'routes/refer/refer';

import otherwiseTemplate from 'routes/not-found/not-found.html!text';
import error500Template from 'routes/errors/500.html!text';

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
		accountRoute.name,
		verifyEmailRoute.name,
		forProvidersRoute.name,
		termsOfService.name,
		refer.name
	])
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider
			.state('error', {
				abstract: true,
				url: '/error',
				template: '<ui-view/>'
			})
			.state('error.500', {
				url: '/500',
				template: error500Template
			})
			.state('otherwise', {
				url: '*path',
				template: otherwiseTemplate,
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
				if (error.$response && error.$response.status && error.$response.status === 500) {
					$state.go('error.500', {}, {
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