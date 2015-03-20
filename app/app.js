import angular from 'angular';
import 'angular-ui-router';
import 'angular-restmod';
import 'angular-restmod-dirty';
import _ from 'lodash';
import 'angulartics';
import 'angulartics-ga';

import routes from 'routes/routes';
import header from 'components/header/header';

export default angular.module('ethiveApp', [
		'ui.router',
		'restmod',
		'angulartics',
		'angulartics.google.analytics',
		routes.name,
		header.name
	])
	.config(['$locationProvider', 'restmodProvider', function ($locationProvider, restmodProvider) {
		restmodProvider.rebase('DirtyModel'); // Enables $restore, $dirty on models
		$locationProvider.html5Mode(true);
	}])
	.controller('RootCtrl', ['$state', '$rootScope', function ($state, $rootScope) {
		// Used by login link in header to pass current state as param for redirect after login. Also used for logout in header.
		$rootScope.$state = $state;
	}])
	.run(['$rootScope', '$timeout', function ($rootScope, $timeout) {
		// Expose lodash
		$rootScope._ = _;

		// Using setTitle() preserves history when changing title from controllers in ui-router states. By default, prepends a sitewide ending to the title. Can be disabled by setting omitEnd to true.
		var defaultTitle = 'Ethive';
		var title = defaultTitle;
		var titleEnd = ' - Ethive';

		$rootScope.setTitle = function (newTitle, omitEnd) {
			function setTitle () {
				if (newTitle === false) {
					title = defaultTitle;
					return;
				}
				if (omitEnd) {
					title = newTitle;
					return;
				}
				title = newTitle + titleEnd;
			}
			$timeout(setTitle);
		};

		$rootScope.getTitle = function () {
			return title || defaultTitle;
		};
	}]);