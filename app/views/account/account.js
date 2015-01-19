angular.module('ethiveApp').controller('AccountCtrl', function($rootScope, $scope, $modal) {
    if ($rootScope.user) {
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
    }
});