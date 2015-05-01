import angular from 'angular';
import 'angular-ui-router';
import _ from 'lodash';
import 'ngAutocomplete';

import OfferModel from 'models/offer';
import ServiceSelector from 'components/serviceSelector/serviceSelector';

import template from 'routes/provider/newOffer/newOffer.html!text';

export default angular.module('ethiveNewOfferRoute', [
		'ui.router',
		'ngAutocomplete',
		OfferModel.name,
		ServiceSelector.name // Directive used in template
	])
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider.state('provider.existing.newOffer', {
			url: '/offers/new',
			template: template,
			controller: ['$scope', '$state', 'provider', '$http', function ($scope, $state, provider, $http) {
				$scope.setTitle('Create a new offer');

				$scope.provider = provider;
				$scope.newOffer = {};
				//$scope.newOffer = provider.offers.$build();

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

				// TODO Proxy this call, set up as a service.
				$http.jsonp('http://openexchangerates.org/api/currencies.json?app_id=9f55d699ea684dba9fa19a3491bd7557&callback=JSON_CALLBACK').success(function (data) {
					$scope.currencies = _.map(data, function (el, key) {
						return {
							code: key,
							name: el
						};
					});
				});

				$scope.submit = function (form) {
					form.validate = function () {
						angular.forEach(form, function (field, key) {
							if (!key.match(/^\$/) && field.$validate) field.$validate();
						});
					};
					provider.offers.$create($scope.newOffer).$then(function (resp) {
						// offer creation success!
						// follow through by navigating to the offer
						console.log(resp)
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