'use strict';

angular.module('ethiveApp')
	.controller('ServiceCtrl', function($scope, $stateParams, $resource) {
		var Service = $resource('/api/services/' + $stateParams.serviceID);
		$scope.service = Service.get();
	});