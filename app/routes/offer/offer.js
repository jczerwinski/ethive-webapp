import angular from 'angular';
import 'angular-ui-router';
import 'angular-bootstrap';

import editOfferRoute from './editOffer/editOffer';

import OfferModel from 'models/offer';

import template from 'routes/offer/offer.html!text';
import confirmDeleteTemplate from 'components/confirmDeleteModal/confirmDelete.html!text';

export default angular.module('ethiveOfferRoute', [
		'ui.router',
		'ui.bootstrap',
		editOfferRoute.name,
		OfferModel.name
	])
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider
			.state('offer', {
				url: '/offers/:offerID',
				abstract: true,
				template: '<ui-view />',
				resolve: {
					offer: ['Offer', '$stateParams', function (Offer, params) {
						return Offer.$find(params.offerID).$asPromise();
					}]
				},
				controller: ['$scope', 'offer', '$modal', '$state', function ($scope, offer, $modal, $state) {
					$scope.setTitle(offer.service.name + ' - ' + offer.location + ' - ' + offer.provider.name);
					$scope.offer = offer;

					$scope.deleteOffer = function (size) {
						$modal.open({
							template: confirmDeleteTemplate,
							controller: ['$scope', function ($scope) {
								$scope.name = 'this offer';
							}]
						}).result.then(function () {
							// Delete
							return offer.$destroy().$asPromise();
						}).then(function () {
							$state.go('provider.existing.view', {providerID: offer.provider.id});
						});
					};
				}]
			})
			.state('offer.view', {
				url: '',
				template: template
			});
	}]);