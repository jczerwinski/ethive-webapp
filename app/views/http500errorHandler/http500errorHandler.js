angular.module('ethiveApp')
    .factory('alertService', function($rootScope, $timeout) {
        var alertService = {};
        $rootScope.alerts = [];

        alertService.add = function(alert) {
            alert.close = function () {
                alertService.close(this)
            };
            if (alert.timeout) $timeout(alert.close, alert.timeout);

            $rootScope.alerts.push(alert);
        };

        alertService.close = function(alert) {
            $rootScope.alerts.splice($rootScope.alerts.indexOf(alert), 1);
        };

        return alertService;
    })
    .factory('http500errorHandlerInterceptor', function($q, alertService) {
        return {
            responseError: function(response) {
                var s = response.status;
                if (s === 500) {
                    alertService.add({
                        timeout: 8000,
                        type: 'danger',
                        message: 'We are currently experiencing technical difficulties. Please try again in a few minutes.'
                    });
                }
                return $q.reject(response);
            }
        };
    })
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('http500errorHandlerInterceptor');
    });