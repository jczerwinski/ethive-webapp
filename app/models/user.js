import angular from 'angular';
import 'angular-cookies';
import 'grevory/angular-local-storage';
import 'angular-ui-router';

// localstore cookiestore restmod
var USERNAME_REGEXP = /^[a-zA-Z0-9_.]{3,20}$/;
var PASSWORD_REGEXP = /^[a-zA-Z0-9_.]{8,100}$/;
export default angular.module('ethiveUserModel', [
		'LocalStorageModule',
		'ngCookies',
		'ui.router'
	])
	.directive('username', function () {
		return {
			require: 'ngModel',
			link: function (scope, elm, attrs, ctrl) {
				function usernameValidator(username) {
					if (USERNAME_REGEXP.test(username)) {
						// it is valid
						ctrl.$setValidity('username', true);
						return username;
					} else {
						// it is invalid, return undefined (no model update)
						ctrl.$setValidity('username', false);
						return undefined;
					}
				}
				ctrl.$parsers.push(usernameValidator);
			}
		};
	})
	.directive('unavailableUsername', ['User', function (User) {
		return {
			require: 'ngModel',
			link: function (scope, elm, attrs, ctrl) {
				function unavailableUsernameValidator(username) {
					User.$find(username).$then(function () {
						// This condition should never be reached. If it is, it means the user is logged in and is attempting to sign up for a new account. Account signup should be disabled while logged in.
					}, function (error) {
						if (error.$response.status === 404) {
							// Does not exist
							ctrl.$setValidity('unavailableUsername', true);
						} else {
							// May include 403 -- Not Authorized (username exists), or any server error.
							ctrl.$setValidity('unavailableUsername', false);
						}
					});
					return username;
				}
				ctrl.$parsers.push(unavailableUsernameValidator);
			}
		};
	}])
	.directive('unavailableEmail', ['User', function (User) {
		return {
			require: 'ngModel',
			link: function (scope, elm, attrs, ctrl) {
				function unavailableEmailValidator(email) {
					User.$search({
						email: email
					}).$then(function () {
						// This condition should never be reached. If it is, it means the user is logged in and is attempting to sign up for a new account. Account signup should be disabled while logged in.
						// TODO should throw error?
					}, function (error) {
						if (error.$response.status === 404) {
							// Does not exist
							ctrl.$setValidity('unavailableEmail', true);
						} else {
							// May include 403 -- Not Authorized (email exists), or any server error.
							ctrl.$setValidity('unavailableEmail', false);
						}
					});
					return email;
				}
				ctrl.$parsers.push(unavailableEmailValidator);
			}
		};
	}])
	.directive('password', function () {
		return {
			require: 'ngModel',
			link: function (scope, elm, attrs, ctrl) {
				function passwordValidator(password) {
					if (PASSWORD_REGEXP.test(password)) {
						// it is valid
						ctrl.$setValidity('password', true);
						return password;
					} else {
						// it is invalid, return undefined (no model update)
						ctrl.$setValidity('password', false);
						return undefined;
					}
				}
				ctrl.$parsers.push(passwordValidator);
			}
		};
	})
	.directive('autofocus', function () {
		return {
			restrict: 'A',
			link: function (scope, element) {
				element[0].focus();
			}
		};
	})
	.factory('User', ['restmod', function (restmod) {
		return restmod.model('/api/users');
	}])
	.factory('auth', ['$rootScope', function ($rootScope) {
		return {
			request: function (config) {
				// Set the auth token.
				if ($rootScope.auth) {
					config.headers.Authorization = 'Bearer ' + $rootScope.auth.token;
				}
				return config;
			}
		};
	}])
	.config(['$httpProvider', function ($httpProvider) {
		$httpProvider.interceptors.push('auth');
	}])
	.run(['localStorageService', '$rootScope', '$cookieStore', 'User', '$state', function (localStorageService, $rootScope, $cookieStore, User, $state) {
		$rootScope.auth = (function () {
			return localStorageService.get('auth') || $cookieStore.get('auth');
		})();
		if ($rootScope.auth) {
			$rootScope.user = User.$find($rootScope.auth._id);
		}

		$rootScope.setAuth = function (auth) {
			if (auth.remember) {
				localStorageService.set('auth', auth);
			} else {
				$cookieStore.put('auth', auth);
			}
			$rootScope.auth = auth;
			$rootScope.user = User.$find(auth._id);
		};

		$rootScope.logout = function () {
			localStorageService.remove('auth');
			$cookieStore.remove('auth');
			delete $rootScope.auth;
			delete $rootScope.user;
			$state.reload();
		};
	}]);