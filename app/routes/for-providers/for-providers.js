import angular from 'angular';
import 'angular-ui-router';
import template from './for-providers.html!text';

export default angular.module('ethiveForProvidersRoute', [
	'ui.router'
])
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider.state('for-providers', {
			url: '/for-providers',
			template: template
		})
	}]);