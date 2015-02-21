'use strict';
angular.module('ethiveApp')
    .controller('LoginCtrl', function($scope, $http, $rootScope, focus, $state, $stateParams) {
        $rootScope.setTitle('Log in to Ethive');
        $scope.submit = function() {
            // Try to authenticate
            // TODO HTTPS only.
            $http.post('/api/auth', {
                username: $scope.username,
                password: $scope.password
            }).then(function(response) {
                // Tronsitioning first prevents 'already logged in' message from displaying
                response.data.remember = $scope.remember;
                return $state.go($stateParams.next.state || 'root')
                    .then(function() {
                        $rootScope.setAuth(response.data);
                    }); //TODO better. Either go to the most recent page, or go to a redirect. see https://github.com/angular-ui/ui-router/issues/92
            })
                .catch(function(error) {
                    if (error.data.message === 'password') {
                        $scope.status = 'password';
                        focus('password');
                    } else if (error.data.message === 'user') {
                        $scope.status = 'user';
                        focus('user');
                    } else if (error.data.message === 'unverified') {
                        $scope.status = 'unverified';
                    } else if (error.data.message === 'brute') {
                        $scope.status = 'brute';
                    } else {
                        // Something is wrong with the server.
                        $scope.status = 'error';
                    }
                });
        };
    });