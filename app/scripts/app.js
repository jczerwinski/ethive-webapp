'use strict';

angular.module('ethiveApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ui.router',
	'restangular'
])
	.config(function($locationProvider, $stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('root', {
				url: '/',
				templateUrl: 'views/home.html',
				controller: 'HomeCtrl'
			})
			.state('service', {
				url: '/services/:serviceID',
				templateUrl: 'views/service.html',
				controller: 'ServiceCtrl'
			})
			.state('provider', {
				url: '/providers/:providerID',
				templateUrl: 'views/provider.html',
				controller: 'ProviderCtrl'
			})
			.state('offer', {
				url: '/providers/:providerID/offers/:offerID',
				templateUrl: 'views/offer.html',
				controller: 'OfferCtrl'
			})
			.state('login', {
				url: '/login',
				templateUrl: 'views/login.html',
				controller: 'LoginCtrl'
			});

		$locationProvider.html5Mode(true);
	});