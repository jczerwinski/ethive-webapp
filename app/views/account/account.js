angular.module('ethiveApp').controller('AccountCtrl', function($rootScope, $scope, $modal) {
    $rootScope.setTitle('Your account' + $rootScope.titleEnd);
    if ($rootScope.user) {
        $scope.open = function() {
            var modalInstance = $modal.open({
                templateUrl: '/views/provider/new/new.html',
                controller: 'NewProviderCtrl'
            });
        };
        $rootScope.user.$refresh();
    }
});