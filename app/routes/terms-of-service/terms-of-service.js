import angular from 'angular';
import 'angular-ui-router';

import template from './terms-of-service.html!text';

export default angular.module('ethiveTermsOfService', [
	'ui.router'
]).config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('terms-of-service', {
		url: '/terms-of-service',
		template: template
	});
}])