import angular from 'angular';
import 'angular-ui-router';
import 'angular-restmod';
import _ from 'lodash';

import routes from 'routes/routes';

export default angular.module('ethiveApp', [
/*		'ngCookies',
		'ngResource',
		'ngSanitize',
		'ui.router',
		'LocalStorageModule',
		'focusOn',
		'ui.bootstrap',
		'ui.validate',
		'restangular',
		'restmod',
		'ngAutocomplete',
		'ui.router',
		'restmod',*/
		'ui.router',
		'restmod',
		routes.name
	])
	.config(['$locationProvider', function ( $locationProvider) {
		//restmodProvider.rebase('DirtyModel'); // Why?
		$locationProvider.html5Mode(true);
	}])
	.controller('RootCtrl', ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope) {
		// Used by login link in header to pass current state as param for redirect after login.
		$rootScope.$state = $state;

		/*$rootScope.title = $rootScope.defaultTitle = 'Ethive';
		$rootScope.titleEnd = ' - ' + $rootScope.defaultTitle;*/
	}])
	.run(['$rootScope', '$timeout', function ($rootScope, $timeout) {
		// Expose lodash
		$rootScope._ = _;

		// Using setTitle() preserves history when changing title from controllers in ui-router states. By default, prepends a sitewide ending to the title. Can be disabled by setting omitEnd to true.
		var defaultTitle = 'Ethive';
		var title = defaultTitle;
		var titleEnd = ' - Ethive';

		$rootScope.setTitle = function (newTitle, omitEnd) {
			$timeout(setTitle);
			function setTitle () {
				if (newTitle === false) {
					return title = defaultTitle;
				}
				if (omitEnd) {
					return title = newTitle;
				}
				title = newTitle + titleEnd;
			}
		};

		$rootScope.getTitle = function () {
			return title || defaultTitle;
		};
	}]);