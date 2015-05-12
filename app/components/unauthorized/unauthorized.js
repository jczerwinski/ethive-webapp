import angular from 'angular';
import template from './unauthorized.html!text';

export default angular.module('ethive.errors', [])
.directive('ethiveUnauthorized', [function () {
	return {
		template: template
	};
}]);