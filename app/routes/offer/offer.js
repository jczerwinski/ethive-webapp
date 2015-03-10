import angular from 'angular';
import 'angular-ui-router';

import OfferModel from 'models/offer';

export default angular.module('ethiveOfferRoute', [
        'ui.router',
        OfferModel.name
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('offer', {
            url: '/providers/:providerID/offers/:offerID',
            templateUrl: 'routes/offer/offer.html',
            resolve: {
                offer: ['Offer', '$stateParams', function (Offer, params) {
                    return Offer.$find(params.offerID);
                }]
            },
            controller: ['$scope', '$rootScope', 'offer', function ($scope, $rootScope, offer) {
                $rootScope.setTitle(offer.service.name + ' - ' + offer.location + ' - ' + offer.provider.name);
                $scope.offer = offer;
            }]
        });
    }]);