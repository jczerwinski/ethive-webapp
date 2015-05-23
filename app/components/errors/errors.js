import angular from 'angular';
import 'angular-bootstrap';

import notFoundTemplate from './not-found.html!text';
import unauthorizedTemplate from './unauthorized.html!text';
import serverTemplate from './server.html!text';

export default angular.module('ethive.errors', [
		'ui.bootstrap'
	])
.factory('ethiveServerErrorAlertService', ['$timeout', '$injector', function ($timeout, $injector) {
	var modal, active, timeout;
	function alert () {
		if (!active) {
			var $modal = $injector.get('$modal');
			modal = $modal.open({
				template: serverTemplate
			});
			modal.result.finally(close);
			modal.opened.finally(open);
		}
	}
	function close () {
		active = false;
		$timeout.cancel(timeout);
	}
	function open () {
		active = true;
		timeout =  $timeout(modal.close, 8000);
	}
	return alert;
}])
.factory('ethiveServerErrorInterceptor', ['$q', 'ethiveServerErrorAlertService', function ($q, alert) {
	return {
		responseError: function (err) {
			if (err.status === 0) {
				// Client-server connection error. Server offline maybe.
				alert();
			} else if (err.status === 500) {
				// Uncaught server error. Bad news.
				alert();
			}
			return $q.reject(err);
		}
	}
}])
.directive('ethiveServerErrorAlert', ['ethiveServerErrorAlertService', function (alert) {
	return {
		link: function (scope, elem, attrs) {
			var parent = elem.parent();
			scope.$watch(function () {
				return alert.active;
			}, function (alert) {
				if (alert) {
					parent.prepend(elem);
				} else {
					elem.detach();
				}
			});
		},
		template: serverTemplate
	};
}])
.config(['$httpProvider', function ($httpProvider) {
	$httpProvider.interceptors.push('ethiveServerErrorInterceptor');
}])
.directive('ethiveUnauthorized', [function () {
	return {
		template: unauthorizedTemplate
	};
}])
.directive('ethiveNotFound', [function () {
	return {
		template: notFoundTemplate
	};
}]);