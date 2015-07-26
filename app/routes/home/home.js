import angular from 'angular';
import 'angular-ui-router';

import Service from 'models/service';
import template from 'routes/home/home.html!text';

export default angular.module('ethiveHome', [
		'ui.router',
		Service.name
	])
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider.state('home', {
			url: '/',
			template: template,
			controller: ['$scope','services', function ($scope, services) {
				$scope.setTitle(false);
				$scope.services = services;
			}],
			resolve: {
				services: ['Service', function (Service) {
					return Service.$forest({
						level: 2
					}).$asPromise();
				}]
			}
		});
	}])
	.directive('collection', [function () {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				collection: '='
			},
			template: '<ul><member ng-repeat="member in collection | orderBy: \'name\'" member="member"></member></ul>'
		};
	}])
	.directive('member', ['$compile', function ($compile) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				member: '='
			},
			template: '<li><a ui-sref="service.existing.view({serviceID: member.id})">{{member.name}}</a></li>',
			link: function (scope, element) {
				var collectionSt = '<collection collection="member.children"></collection>';
				if (angular.isArray(scope.member.children)) {
					$compile(collectionSt)(scope, function (cloned) {
						element.append(cloned);
					});
				}
			}
		};
	}])
	.directive('error', [function () {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				error: '='
			},
			template: '<div class="error" ng-if="error"><span class="glyphicon glyphicon-remove-circle"></span>Oops! Something went wrong. We\'re looking into it. Try back again later.</div>'
		};
	}]);