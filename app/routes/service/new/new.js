import angular from 'angular';
import 'angular-ui-router';
import serviceSelectorSearch from 'components/serviceSelectorSearch/serviceSelectorSearch';

import template from 'routes/service/new/new.html!text';

// Directive used in template
import errors from 'components/errors/errors';

export default angular.module('ethiveNewServiceRoute', [
		'ui.router',
		errors.name,
		serviceSelectorSearch.name
	])
	.controller('NewServiceCtrl', ['$scope', '$state', 'Service', 'service', function ($scope, $state, Service, service) {
		var newService = $scope.newService = {};
		if (service) {
			$scope.service = service;
			$scope.setTitle('Create New Subservice - ' + service.name);
			newService.parent = service;
		} else {
			$scope.setTitle('Create New Service');
		}
		$scope.serviceSelectorFilter = function (service) {
			return service.isAdministeredBy($scope.user) &&
				service.type === 'category'
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