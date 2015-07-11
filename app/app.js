import angular from 'angular';
import 'angular-ui-router';
import 'angular-restmod';
import 'angular-restmod-dirty';
import _ from 'lodash';
import 'luisfarzati/angulartics';
import 'luisfarzati/angulartics-ga';
import baseModel from 'models/baseModel';
import errors from 'components/errors/errors';

import routes from 'routes/routes';
import header from 'components/header/header';

import 'chieffancypants/angular-hotkeys';

export default angular.module('ethiveApp', [
		'ui.router',
		'restmod',
		'angulartics',
		'angulartics.google.analytics',
		'cfp.hotkeys',
		baseModel.name,
		routes.name,
		header.name,
		errors.name
	])
	.config(['$locationProvider', 'restmodProvider', function ($locationProvider, restmodProvider) {
		restmodProvider.rebase('DirtyModel', 'EthiveBaseModel'); // Enables $restore, $dirty on models

		$locationProvider.html5Mode(true);
	}])
	.run(['$rootScope', '$timeout', 'hotkeys', '$state', function ($rootScope, $timeout, hotkeys, $state) {
		// Expose lodash
		$rootScope._ = _;

		// Bind global hotkeys
		hotkeys.bindTo($rootScope).add({
			combo: 'a',
			description: 'Cancel create new provider',
			callback: function (event) {
				event.preventDefault();
				$state.go('account');
			}
		}).add({
			combo: 'h',
			description: 'Go to home page',
			callback: function (event) {
				event.preventDefault();
				$state.go('home');
			}
		});

		// Using setTitle() preserves history when changing title from controllers in ui-router states. By default, prepends a sitewide ending to the title. Can be disabled by setting omitEnd to true.
		var defaultTitle = 'ethive';
		var title = defaultTitle;
		var titleEnd = ' - ' + defaultTitle;

		$rootScope.setTitle = function (newTitle, omitEnd) {
			function setTitle() {
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