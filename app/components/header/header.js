import angular from 'angular';
import template from './header.html!text';

export default angular.module('ethiveHeader', []).directive('ethiveHeader', [function () {
	return {
		restrict: 'E',
		template: template
	};
}]);