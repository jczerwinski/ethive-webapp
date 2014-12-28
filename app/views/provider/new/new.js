'use strict';

angular.module('ethiveApp')
    .controller('NewProviderCtrl', function($scope, $modalInstance, Provider, $state) {
        $scope.newProvider = Provider.$build({
            admins: [$scope.user]
        });

        $scope.submit = function (form) {
            form.validate = function () {
                 angular.forEach(form, function (field, key) {
                    if (!key.match(/^\$/) && field.$validate) field.$validate();
                });
            };
            
            $scope.newProvider.$save().$then(function (response) {
                // provider creation success!
                // close modal and navigate back to the last page, refreshed:
                $scope.cancel();
                $state.go('provider', {}, {
                    providerID: $scope.newProvider._id
                });
            }, function (response) {
                // Should only ever get here if theres a server-side validation error, which should always be checked on the client side. No need for an error message if this is the case. Get the client side right!
                form.validate();
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    });