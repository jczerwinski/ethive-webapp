import angular from 'angular';

export default angular.module('ethiveServiceBreadcrumbs', [])
.directive('ethiveServiceBreadcrumbs', ['$compile', function ($compile) {
	return {
		restrict: 'E',
		scope: {
			service: '=',
			link: '='
		},
		template: '<a ng-if="link" ui-sref="service.existing.view({serviceID: service.id})">{{service.name}}</a><span ng-if="!link">{{service.name}}</span>',
		link: function (scope, elem, attrs) {
			if (scope.service.parent) {
				var parentTemplate = '<ethive-service-breadcrumbs service="service.parent" link="true"></ethive-service-breadcrumbs>&nbsp;>&nbsp;';
				$compile(parentTemplate)(scope, function (parentElem) {
					elem.prepend(parentElem);
				});
			} else {
				var serviceTemplate = '<a ui-sref="home">Services</a>&nbsp;>&nbsp;'
				$compile(serviceTemplate)(scope, function (parentElem) {
					elem.prepend(parentElem);
				});
			}
		}
	};
}]);