import angular from 'angular';
import 'angular-bootstrap';
import 'angular-ui-router';
import 'ng-focus-on';
import selectOnFocus from 'components/selectOnFocus/selectOnFocus';
import 'Elijen/angular-popover-toggle';

import './search-bar.css!';

import serviceSelectorSearch from 'components/serviceSelectorSearch/serviceSelectorSearch';

import template from './search-bar.html!text';

export default angular.module('ethiveSearchBar', [
	'ui.router',
	'ui.bootstrap',
	'focusOn',
	'popoverToggle',
	selectOnFocus.name,
	serviceSelectorSearch.name
])
.run(['$templateCache', function ($templateCache) {
	let popoverTemplate = '<span class="fa fa-exclamation-triangle text-warning" aria-hidden="true"></span> Search for a service and select one from the list provided.';
	$templateCache.put('search-bar-popover-template', popoverTemplate);
}])
.directive('ethiveSearchBar', [function () {
	return {
		restrict: 'E',
		template: template,
		controller: ['$scope', '$state', 'focus', '$timeout', function ($scope, $state, focus, $timeout) {
			$scope.forms = {};
			$scope.search = function () {
				if ($scope.forms.form.$valid) {
					$state.go('service.existing.view', {serviceID: $scope.service.id});
				}
				else {
					// Focus back on search bar.
					focus('search-bar');
					// Enable popover
					$scope.popover = true;
				}
			};
		}]
	};
}]);

