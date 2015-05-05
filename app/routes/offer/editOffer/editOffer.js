import angular from 'angular';
import 'angular-ui-router';
import _ from 'lodash';

import currency from 'components/currency/currency';

import OfferModel from 'models/offer';

import template from 'routes/offer/editOffer/editOffer.html!text';

export default angular.module('ethiveEditOfferRoute', [
		'ui.router',
		currency.name,
		OfferModel.name
	])
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider.state('offer.editOffer', {
			url: '/edit',
			template: template,
			controller: ['$scope', 'offer', '$state', 'currency', function ($scope, offer, $state, currency) {
				$scope.setTitle(offer.service.name + ' - ' + offer.location + ' - ' + offer.provider.name);
				$scope.offer = offer;

				$scope.locationOptions = {
					types: '(cities)'
				};

				$scope.serviceSelectorOptions = {
					navigable: function navigable(service) {
						return service.status === 'published' && service.type === 'category';
					},
					selectable: function selectable(service) {
						return service.status === 'published' && service.type === 'service';
					}
				};

				$scope.currencies = currency.currencyList;

				$scope.submit = function (form) {
					form.validate = function () {
						angular.forEach(form, function (field, key) {
							if (!key.match(/^\$/) && field.$validate) field.$validate();
						});
					};
					$scope.offer.$save().$then(function () {
						// offer creation success!
						// follow through by navigating to the offer
						$state.go('offer.view', { // Go to the offer
							offerID: $scope.offer.id
						});
					}, function (response) {
						// Should only ever get here if theres a server-side validation error, which should always be checked on the client side. No need for an error message if this is the case. Get the client side right!
						form.validate();
					});
				};

				$scope.cancel = function () {
					$state.go('offer.view', {
						offerID: $scope.offer.id
					});
				};
			}]
		});
	}]);