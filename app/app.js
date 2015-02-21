'use strict';

angular.module('ethiveApp', [
		'ngCookies',
		'ngResource',
		'ngSanitize',
		'ui.router',
		'LocalStorageModule',
		'focusOn',
		'ui.bootstrap',
		'ui.validate',
		'restangular',
		'restmod',
		'ngAutocomplete',
		'ui.select'
	])
	.config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('root', {
				url: '/',
				templateUrl: 'views/home/home.html',
				controller: 'HomeCtrl'
			})
			.state('service', {
				url: '/services/:serviceID',
				templateUrl: 'views/service/service.html',
				controller: 'ServiceCtrl'
			})
			.state('service.newService', {
				url: '/new',
				templateUrl: 'views/service/new/new.html',
				controller: 'CreateServiceCtrl'
			})
			.state('service.editService', {
				url: '/edit',
				templateUrl: 'views/service/edit/edit.html',
				controller: 'EditServiceCtrl'
			})
			.state('provider.newProvider', {
				url: '/new'
			})
			.state('provider', {
				url: '/providers/:providerID',
				templateUrl: 'views/provider/provider.html',
				controller: 'ProviderCtrl'
			})
			.state('offer', {
				url: '/providers/:providerID/offers/:offerID',
				templateUrl: 'views/offer/offer.html',
				controller: 'OfferCtrl'
			})
			.state('login', {
				url: '/login',
				templateUrl: 'views/login/login.html',
				controller: 'LoginCtrl',
				params: {
					next: {
						// state: state to transition to after login
						// params: state params for the next state
					}
				}
			})
			.state('signup', {
				url: '/signup',
				templateUrl: 'views/signup/signup.html',
				controller: 'SignupCtrl'
			})
			.state('signup.success', {
				url: '/success',
				templateUrl: 'views/signup/signup.success.html'
			})
			.state('signup.failure', {
				url: '/failure',
				templateUrl: 'views/signup/signup.failure.html',
				controller: 'SignupFailureCtrl'
			})
			.state('verifyEmailSuccess', {
				url: '/verifyEmailSuccess',
				templateUrl: 'views/verifyEmail/verifyEmailSuccess.html'
			})
			.state('verifyEmailFailure', {
				url: '/verifyEmailFailure',
				templateUrl: 'views/verifyEmail/verifyEmailFailure.html'
			})
			.state('account', {
				url: '/account',
				templateUrl: 'views/account/account.html',
				controller: 'AccountCtrl'
			})
			.state('otherwise', {
				url: '*path',
				templateUrl: 'views/not-found/not-found.html',
				controller: function ($rootScope) {
					$rootScope.setTitle('Not found' + $rootScope.titleEnd);
				}
			});

		$locationProvider.html5Mode(true); // Enables client-side routing without hashbangs (#)
	})
	.controller('RootCtrl', function ($scope, $state, $rootScope) {
		// Used by login link in header to pass current state as param for redirect after login.
		$rootScope.$state = $state;

		$rootScope.title = $rootScope.defaultTitle = 'Ethive';
		$rootScope.titleEnd = ' - ' + $rootScope.defaultTitle;
	})
	.run(function ($rootScope, $timeout) {
		// Using setTitle() preserves history when changing title from controllers in ui-router states.
		$rootScope.setTitle = function (newTitle) {
			$timeout(setTitle);
			function setTitle () {
				$rootScope.title = newTitle;
			}
		};
	})
	.config(function (restmodProvider, uiSelectConfig) {
		uiSelectConfig.theme = 'bootstrap'; // https://github.com/angular-ui/ui-select/wiki/ui-select
		restmodProvider.rebase('DirtyModel'); // Why?
	});