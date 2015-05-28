import angular from 'angular';
import template from './header.html!text';

import 'angular-bootstrap';

export default angular.module('ethiveHeader', [
	'ui.bootstrap'
	])
	.directive('ethiveHeader', [function () {
		return {
			restrict: 'E',
			template: template,
			scope: true
		};
	}]);