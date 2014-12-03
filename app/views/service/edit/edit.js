'use strict';

angular.module('ethiveApp')
    .controller('EditServiceCtrl', function($scope, Service, $state) {

        $scope.service.$then(function () {
            $scope.service.parent = $scope.service.parent._id;
        });

        $scope.submit = function () {
            $scope.service.$save().$then(function () {
                return $state.go('service', {}, {reload: true});
            });
        };

        $scope.cancel = function () {
            $scope.service.$restore();
            $state.go('service');
        };
    });
