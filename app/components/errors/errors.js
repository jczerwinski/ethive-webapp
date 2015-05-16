import angular from 'angular';

import notFoundTemplate from './not-found.html!text';
import unauthorizedTemplate from './unauthorized.html!text';

export default angular.module('ethive.errors', [])
.directive('ethiveUnauthorized', [function () {
	return {
		template: unauthorizedTemplate
	};
}])
.directive('ethiveNotFound', [function () {
	return {
		template: notFoundTemplate
	};
}]);