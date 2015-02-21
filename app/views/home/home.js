'use strict';

angular.module('ethiveApp')
.controller('HomeCtrl', function($resource, $scope, $rootScope) {
	$rootScope.setTitle($rootScope.defaultTitle);

	var ServiceIndex = $resource('/api/services', {}, {
		get: {
			method: 'GET',
			isArray: true
		}
	});

	ServiceIndex.get().$promise.then(function (res) {
		$scope.services = res;
	}).catch(function(err) {
		$scope.error = err;
	});
})
.directive('collection', function () {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			collection: '='
		},
		template: '<ul><member ng-repeat="member in collection" member="member"></member></ul>'
	};
})
.directive('member', function ($compile) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			member: '='
		},
		template: '<li><a ui-sref="service({serviceID: member._id})">{{member.name}}</a></li>',
		link: function (scope, element) {
			var collectionSt = '<collection collection="member.children"></collection>';
			if (angular.isArray(scope.member.children)) {
				$compile(collectionSt)(scope, function(cloned) {
					element.append(cloned);
				});
			}
		}
	};
})
.directive('error', function () {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			error: '='
		},
		template: '<div class="error" ng-if="error"><span class="glyphicon glyphicon-remove-circle"></span>Oops! Something went wrong. We\'re looking into it. Try back again later.</div>'
	};
});