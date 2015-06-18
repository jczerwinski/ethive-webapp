import angular from 'angular';
import 'angular-bootstrap';
import Service from 'models/service';
import _ from 'lodash';

export default angular.module('ethiveServiceSelectorSearch', [
	Service.name,
	'ui.bootstrap'
	]).directive('ethiveServiceSelectorSearch', ['$compile', function ($compile) {
	return {
		restrict: 'A',
		priority: 1000,
		terminal: true,
		controller: ['Service', '$scope', function (Service, $scope) {
			this.search = function (name) {
				return Service.$search({search: name}).$asPromise().then(function (services) {
					if ($scope.filter) {
						return _.filter(services, $scope.filter);
					}
					return services;
				});
			};
		}],
		controllerAs: 'ctrl',
		bindToController: true,
		link: function (scope, elem, attrs) {
			scope.filter = scope.$eval(attrs.filter);
			elem.removeAttr('ethive-service-selector-search');
			elem.attr('typeahead', 'service as service.name for service in ctrl.search($viewValue) | limitTo:10');
			elem.attr('typeahead-editable', 'false');
			$compile(elem)(scope);
		}
	};
}]);