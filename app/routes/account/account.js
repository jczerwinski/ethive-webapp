import angular from 'angular';
import 'angular-ui-router';
import 'angular-bootstrap';

export default angular.module('ethiveAccountRoute', [
        'ui.router',
        'ui.bootstrap.modal'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('account', {
            url: '/account',
            templateUrl: 'routes/account/account.html',
            controller: 'AccountCtrl'
        });
    }])
    .controller('AccountCtrl', ['$rootScope', '$scope', '$modal', function ($rootScope, $scope, $modal) {
        $rootScope.setTitle('Your account');
        if ($rootScope.user) {
            $scope.open = function () {
                var modalInstance = $modal.open({
                    templateUrl: '/views/provider/new/new.html',
                    controller: 'NewProviderCtrl'
                });
            };
            $rootScope.user.$refresh();
        }
    }]);