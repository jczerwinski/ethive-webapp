import angular from 'angular';
import 'angular-ui-router';
import serviceSelectorSearch from 'components/serviceSelectorSearch/serviceSelectorSearch';

import template from 'routes/service/edit/edit.html!text';

export default angular.module('ethiveEditServiceRoute', [
		'ui.router',
		serviceSelectorSearch.name
	])
	.controller('EditServiceCtrl', ['$scope', '$state', 'service', function ($scope, $state, service) {
		$scope.service = service;
		$scope.setTitle('Editing ' + service.name);
		$scope.forms = {};

		$scope.serviceSelectorFilter = function (service) {
			return service.isAdministeredBy($scope.user) &&
				service.type === 'category' &&
				!service.equals($scope.service) &&
				!service.hasAncestor($scope.service);
		};

		$scope.submit = function () {
			$scope.service.$save().$then(function (selectingrvice) {
				return $state.go('^.view', {}, {
					reload: true
				});
			});
		};

		$scope.cancel = function () {
			$scope.service.$restore();
			$state.go('^.view');
		};
	}]);