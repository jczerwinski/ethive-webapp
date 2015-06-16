import angular from 'angular';
import 'angular-bootstrap';
import Service from 'models/service';
import template from './serviceSelectorSearch.html!text';
import _ from 'lodash';

export default angular.module('ethiveServiceSelectorSearch', [
	Service.name
	]).directive('ethiveServiceSelectorSearch', [function () {
	return {
		template: template,
		restrict: 'E',
		scope:{
			selected: '=ngModel',
			filter: '&'
		},
		controller: ['Service', '$scope', function (Service, $scope) {
			this.search = function (name) {
				var query = {search: name};
				if ($scope.filter) {
					_.extend(query, $scope.filter);
				}
				return Service.$search(query).$asPromise();
			};
		}],
		controllerAs: 'ctrl'
	};
}]);