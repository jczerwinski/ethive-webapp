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
	'ngAutocomplete'
])
	.config(function($locationProvider, $stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('root', {
				url: '/',
				templateUrl: 'views/home/home.html',
				controller: 'HomeCtrl'
			})
			.state('service', {
				url: '/services/:serviceID',
				templateUrl: 'views/service/service.html',
				controller: 'ServiceCtrl',
			})
			.state('service.newService', {
				url: '/new',
				templateUrl: 'views/service/new/new.html',
				controller: 'CreateServiceCtrl',
			})
			.state('service.editService', {
				url: '/edit',
				templateUrl: 'views/service/edit/edit.html',
				controller: 'EditServiceCtrl',
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
				controller: 'LoginCtrl'
			})
			.state('signup', {
				url: '/signup',
				templateUrl: 'views/signup/signup.html',
				controller: 'SignupCtrl',
			})
			.state('signup.success', {
				url: '/success',
				templateUrl: 'views/signup/signup.success.html'
			})
			.state('signup.failure', {
				url: '/failure',
				templateUrl: 'views/signup/signup.failure.html',
				controller: 'SignupFailureCtrl',
			})
			.state('verifyEmailSuccess', {
				url: '/verifyEmailSuccess',
				templateUrl: 'views/verifyEmail/verifyEmailSuccess.html'
			})
			.state('verifyEmailFailure', {
				url: '/verifyEmailFailure',
				templateUrl: 'views/verifyEmail/verifyEmailFailure.html'
			})
			.state('user', {
				url: '/users/:userID',
				templateUrl: 'views/user/user.html',
				controller: 'UserCtrl'
			});

		$locationProvider.html5Mode(true); // Enables client-side routing without hashbangs (#)
	})
	.controller('RootCtrl', function($scope, $state, $rootScope) {
		// Used by login link in header to pass current state as param for redirect after login.
		$scope.$state = $state;

		$rootScope.title = 'Ethive';
	})
	.config(function(restmodProvider) {
		restmodProvider.rebase('DirtyModel');
	});