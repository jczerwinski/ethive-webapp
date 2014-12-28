angular.module('ethiveApp').controller('UserCtrl', function($rootScope, $scope, $modal) {
    $scope.open = function(size) {
        var modalInstance = $modal.open({
            templateUrl: '/views/provider/new/new.html',
            controller: 'NewProviderCtrl'
            //size: size,
            /*resolve: {
                    items: function() {
                        return $scope.items;
                    }
                }*/
        });
    };
    $rootScope.user.$refresh();
});