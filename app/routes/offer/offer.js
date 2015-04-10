import angular from 'angular';
import 'angular-ui-router';

import editOfferRoute from './editOffer/editOffer';

import OfferModel from 'models/offer';

import template from 'routes/offer/offer.html!text';

export default angular.module('ethiveOfferRoute', [
        'ui.router',
        editOfferRoute.name,
        OfferModel.name
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('offer', {
            url: '/offers/:offerID',
            abstract: true,
            template: '<ui-view />',
            resolve: {
                offer: ['Offer', '$stateParams', function (Offer, params) {
                    return Offer.$find(params.offerID).$asPromise();
                }]
            },
            controller: ['$scope', '$rootScope', 'offer', function ($scope, $rootScope, offer) {
                $rootScope.setTitle(offer.service.name + ' - ' + offer.location + ' - ' + offer.provider.name);
                $scope.offer = offer;
            }]
        })
        .state('offer.view', {
            url: '',
            template: template,
        })
    }]);