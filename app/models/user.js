import angular from 'angular';
import 'angular-cookies';
import 'grevory/angular-local-storage';
import 'angular-ui-router';
import currency from 'components/currency/currency';

import config from 'app-config';

var USERNAME_REGEXP = /^[a-zA-Z0-9_.]{3,20}$/;
var PASSWORD_REGEXP = /^[a-zA-Z0-9_.]{8,}$/;
export default angular.module('ethiveUserModel', [
		currency.name,
		'LocalStorageModule',
		'ngCookies',
		'ui.router',
		config.name
	])
	.directive('username', [function () {
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
	}])
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
	.directive('password', [function () {
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
	}])
	.directive('autofocus', [function () {
		return {
			restrict: 'A',
			link: function (scope, element) {
				element[0].focus();
			}
		};
	}])
	.factory('User', ['restmod', '$locale', 'localeCurrencyFilter', '$http', 'config', function (restmod, $locale, localeCurrencyFilter, $http, config) {
		return restmod.model('/users').mix({
			$extend: {
				Model: {
					verifyEmail: function (verificationKey) {
						return $http.get(config.apiRoot + '/verifyEmail/' + verificationKey);
					}
				},
				Record: {
					isLoggedIn: function () {
						return !!this._id;
					},
					changePassword: function (passwords) {
						return $http.post(config.apiRoot + '/users/' + this.username + '/changePassword', passwords);
					}
				}
			},
			preferences: {
				init: function () {
					return {
						currency: localeCurrencyFilter($locale.id)
					};
				}
			}
		});
	}])
	.factory('auth', ['$rootScope', 'localStorageService', '$cookies', '$http', 'User', '$state', 'config', function ($rootScope, localStorageService, $cookies, $http, User, $state, config) {
		return {
			init: function () {
				$rootScope.auth = localStorageService.get('auth') || $cookies.getObject('auth');
				if ($rootScope.auth) {
					$rootScope.user = User.$find($rootScope.auth.username);
				} else {
					$rootScope.user = User.$build();
				}
			},
			login: function (credentials, remember) {
				return $http.post(config.apiRoot + '/auth', credentials).then(function(response) {
					$rootScope.auth = response.data;
					if (remember) {
						localStorageService.set('auth', $rootScope.auth);
					} else {
						$cookies.putObject('auth', $rootScope.auth);
					}
					return User.$find($rootScope.auth.username).$asPromise().then(function (user) {
						$rootScope.user = user;
						return user;
					});
				});
			},
			logout: function () {
				localStorageService.remove('auth');
				$cookies.remove('auth');
				$rootScope.auth = undefined;
				delete $rootScope.user;
				$rootScope.user = User.$build();
				return $state.go('home', {}, {reload: true});
			}
		};
	}])
	.factory('authInterceptor', ['config', '$rootScope', function (appConfig, $rootScope) {
		// HTTP Interceptor
		return {
			request: function (config) {
				// Set the auth token.
				if (config.url.match('^' + appConfig.apiRoot)) {
					if ($rootScope.auth) {
						config.headers.Authorization = 'Bearer ' + $rootScope.auth.token;
					}
				}
				return config;
			}
		};
	}])
	.config(['$httpProvider', function ($httpProvider) {
		$httpProvider.interceptors.push('authInterceptor');
	}])
	.run(['auth', '$rootScope', function (auth, $rootScope) {
		auth.init();
		$rootScope.login = auth.login;
		$rootScope.logout = auth.logout;
	}]);