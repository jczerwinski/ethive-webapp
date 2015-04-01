import angular from 'angular';
import 'angular-ui-router';

import OfferModel from 'models/offer';

import template from 'routes/offer/offer.html!text';

export default angular.module('ethiveOfferRoute', [
        'ui.router',
        OfferModel.name
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('offer', {
            url: '/offers/:offerID',
            template: template,
            resolve: {
                offer: ['Offer', '$stateParams', function (Offer, params) {
                    return Offer.$find(params.offerID).$asPromise();
                }]
            },
            controller: ['$scope', '$rootScope', 'offer', function ($scope, $rootScope, offer) {
                $rootScope.setTitle(offer.service.name + ' - ' + offer.location + ' - ' + offer.provider.name);
                $scope.offer = offer;
            }]
        });
    }]);