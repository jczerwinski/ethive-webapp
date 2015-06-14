import angular from 'angular';
import 'angular-ui-router';
import _ from 'lodash';
import 'ngAutocomplete';

//import ServiceSelectorSearch from 'components/serviceSelectorSearch/serviceSelectorSearch';

import currency from 'components/currency/currency';

import OfferModel from 'models/offer';
import ServiceSelector from 'components/serviceSelector/serviceSelector';

import template from 'routes/provider/newOffer/newOffer.html!text';

export default angular.module('ethiveNewOfferRoute', [
		'ui.router',
		'ngAutocomplete',
		ServiceSelectorSearch.name,
		OfferModel.name,
		currency.name,
		ServiceSelector.name // Directive used in template
	])
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider.state('provider.existing.newOffer', {
			url: '/offers/new',
			template: template,
			controller: ['$scope', '$state', 'provider', 'currency', function ($scope, $state, provider, currency) {
				$scope.setTitle('Create a new offer');

				$scope.provider = provider;
				$scope.newOffer = {};

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
					provider.offers.$create($scope.newOffer).$then(function (resp) {
						// offer creation success!
						// follow through by navigating to the offer
						$state.go('offer.view', { // Go to the offer
							offerID: resp.id
						});
					}, function (response) {
						// Should only ever get here if theres a server-side validation error, which should always be checked on the client side. No need for an error message if this is the case. Get the client side right!
						form.validate();
					});
				};

				$scope.cancel = function () {
					$state.go('^.view');
				};
			}]
		});
	}]);