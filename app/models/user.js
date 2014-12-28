var USERNAME_REGEXP = /^[a-zA-Z0-9_.]{3,20}$/;
var PASSWORD_REGEXP = /^[a-zA-Z0-9_.]{8,100}$/;
angular.module('ethiveApp')
	.directive('username', function() {
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				function usernameValidator (username) {
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
	.directive('unavailableUsername', function(User) {
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				function unavailableUsernameValidator (username) {
					User.get({
						username: username
					}).$promise
						.then(function (user) {
							ctrl.$setValidity('unavailableUsername', false);
						})
						.catch(function (error) {
							ctrl.$setValidity('unavailableUsername', true);
						});
					return username;
				}
				ctrl.$parsers.push(unavailableUsernameValidator);
			}
		};
	})
	.directive('unavailableEmail', function(User) {
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				function unavailableEmailValidator (email) {
					User.get({
						email: email
					}).$promise
						.then(function (user) {
							ctrl.$setValidity('unavailableEmail', false);
						})
						.catch(function (error) {
							ctrl.$setValidity('unavailableEmail', true);
						});
					return email;
				}
				ctrl.$parsers.push(unavailableEmailValidator);
			}
		};
	})
	.directive('password', function() {
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				function passwordValidator (password) {
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
	.directive('autofocus', function() {
		return {
			restrict: 'A',
			link: function(scope, element) {
				element[0].focus();
			}
		};
	})
	.factory('User', function(restmod) {
		return restmod.model('/api/users');
	})
	.run(function(localStorageService, $rootScope, $cookieStore, User) {
		$rootScope.auth = (function() {
			return localStorageService.get('auth') || $cookieStore.get('auth');
		})();
		if ($rootScope.auth) $rootScope.user = User.$find($rootScope.auth._id);

		$rootScope.setAuth = function(auth) {
			if (auth.remember) {
				localStorageService.set('auth', auth);
			} else {
				$cookieStore.put('auth', auth);
			}
			$rootScope.auth = auth;
			$rootScope.user = User.$find(auth._id);
		};

		$rootScope.logout = function() {
			localStorageService.remove('auth');
			$cookieStore.remove('auth');
			delete $rootScope.auth;
			delete $rootScope.user;
		};
	})
	.factory('auth', function($rootScope) {
		return {
			request: function(config) {
				// Set the auth token.
				if ($rootScope.auth) {
					config.headers.Authorization = 'Bearer ' + $rootScope.auth.token;
				}
				return config;
			}
		};
	})
	.config(function($httpProvider) {
		$httpProvider.interceptors.push('auth');
	});