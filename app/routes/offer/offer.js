import angular from 'angular';
import router from 'angular-ui-router';

export default angular.module('ethiveOfferRoute', [
        router.name
    ])
    .controller('OfferCtrl', ['$scope', '$stateParams', '$resource', '$rootScope', function($scope, $stateParams, $resource, $rootScope) {
        // TODO set title
        var Offer = $resource('/api/providers/:providerID/offers/:offerID');
        $scope.offer = Offer.get({
            providerID: $stateParams.providerID,
            offerID: $stateParams.offerID
        });
        //$rootScope.setTitle(Service Location - Provider - Ethive );
    }])
    .factory('Offer', ['restmod', function (restmod) {
        return restmod.model()
    }]);