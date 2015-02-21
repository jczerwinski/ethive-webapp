'use strict';
angular.module('ethiveApp')
    .controller('OfferCtrl', function($scope, $stateParams, $resource, $rootScope) {
        // TODO set title
        var Offer = $resource('/api/providers/:providerID/offers/:offerID');
        $scope.offer = Offer.get({
            providerID: $stateParams.providerID,
            offerID: $stateParams.offerID
        });
        //$rootScope.setTitle(Service Location - Provider - Ethive );
    })
    .factory('Offer', function (restmod) {
        return restmod.model()
    });