'use strict';

angular.module('ethiveApp')
	.controller('ServiceCtrl', function($scope, $stateParams, $resource) {
		var Service = $resource('/api/services/' + $stateParams.serviceID);
		$scope.service = Service.get();
        $scope.service.isAdministeredBy = function (user) {
            var servicesAdministered = user.servicesAdministered || [];
            return servicesAdministered.some(function (serviceID) {
                return this.isDescendantOf(serviceID);
            });
        };
        $scope.service.isDescedantOf = function (serviceID) {
            var ancestors = this.ancestors || [];
            return ancestors.some(function (ancestor) {
                return ancestor === serviceID;
            });
        };
	});