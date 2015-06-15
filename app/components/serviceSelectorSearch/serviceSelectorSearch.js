import angular from 'angular';
import 'angular-bootstrap';
import Service from 'models/service';
import template from './serviceSelectorSearch.html!text';

export default angular.module('ethiveServiceSelectorSearch', [
	Service.name
	]).directive('ethiveServiceSelectorSearch', [function () {
	return {
		template: template,
		restrict: 'E',
		scope:{
			selected: '=ngModel',
			options: '&'
		},
		controller: ['Service', function (Service) {
			this.services = Service.$search();
		}],
		controllerAs: 'ctrl'
	};
}]);