import angular from 'angular';
import 'angular-ui-router';
import 'angular-bootstrap';

import accountTemplate from 'routes/account/account.html!text';
import newProviderTemplate from 'routes/provider/new/new.html!text';

export default angular.module('ethiveAccountRoute', [
        'ui.router',
        'ui.bootstrap.modal'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('account', {
            url: '/account',
            template: accountTemplate,
            controller: 'AccountCtrl'
        });
    }])
    .controller('AccountCtrl', ['$rootScope', '$scope', '$modal', function ($rootScope, $scope, $modal) {
        $rootScope.setTitle('Your account');
        if ($rootScope.user) {
            $scope.open = function () {
                var modalInstance = $modal.open({
                    template: newProviderTemplate,
                    controller: 'NewProviderCtrl'
                });
            };
            $rootScope.user.$refresh();
        }
    }]);