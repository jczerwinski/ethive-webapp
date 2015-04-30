import angular from 'angular';
import 'angular-ui-router';

import template from 'routes/service/new/new.html!text';

export default angular.module('ethiveNewServiceRoute', [
		'ui.router'
	])
	.controller('NewServiceCtrl', ['$scope', '$state', 'Service', 'service', function ($scope, $state, Service, service) {
		var newService = $scope.newService = {};
		if (service) {
			$scope.setTitle('Create New Subservice - ' + service.name);
			newService.parent = service;
		} else {
			$scope.setTitle('Create New Service');
		}
		$scope.parentOptions = {
			navigable: function navigable (service) {
				// All categories with children are navigable
				return service.type === 'category' && service.children && service.children.length;
			},
			selectable: function selectable (service) {
				// All categories are selectable
				return service.type === 'category';
			}
		};
		$scope.submit = function () {
			var srv = Service.$create(newService).$then(function () {
				return $state.go('service.existing.view', {
					serviceID: newService.id
				});
			});
		};
		$scope.cancel = function () {
			if (service) {
				$state.go('^.view');
			} else {
				$state.go('^.index');
			}
		};
	}]);