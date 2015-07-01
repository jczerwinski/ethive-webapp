import angular from 'angular';
import 'angular-ui-router';
import 'angular-bootstrap';

import currency from 'components/currency/currency';
import googlePlacesAutocomplete from 'components/google-places-autocomplete/google-places-autocomplete';
import OfferModel from 'models/offer';
import ProviderModel from 'models/provider';

import ServiceSelectorSearch from 'components/serviceSelectorSearch/serviceSelectorSearch';

import editNewTemplate from './editNew.html!text';
import viewTemplate from './view.html!text';
import confirmDeleteTemplate from 'components/confirmDeleteModal/confirmDelete.html!text';

export default angular.module('ethiveOfferRoute', [
		'ui.router',
		'ui.bootstrap',
		OfferModel.name,
		ProviderModel.name,
		currency.name,
		googlePlacesAutocomplete.name,
		ServiceSelectorSearch.name
	])
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider
		.state('offer', {
			url: '/offers',
			abstract: true,
			template: '<ui-view />'
		})
		.state('offer.new', {
			url: '/new?providerID&serviceID',
			template: editNewTemplate,
			params: {
				provider: null,
				service: null
			},
			resolve: {
				provider: ['Provider', '$stateParams', function (Provider, $stateParams) {
					if ($stateParams.provider) {
						// To support URL bookmarking
						$stateParams.providerID = $stateParams.provider.id;
						return $stateParams.provider;
					}
					if ($stateParams.providerID) {
						return Provider.$find($stateParams.providerID).$asPromise();
					}
				}],
				service: ['Service', '$stateParams', function (Service, $stateParams) {
					if ($stateParams.service) {
						// To support URL bookmarking
						$stateParams.serviceID = $stateParams.service.id;
						return $stateParams.service;
					}
					if ($stateParams.serviceID) {
						return Service.$find($stateParams.serviceID).$asPromise();
					}
				}]
			},
			controller: ['$scope', '$state', 'provider', 'service', 'currency', 'googlePlacesAutocomplete', 'Offer', function ($scope, $state, provider, service, currency, places, Offer) {
				$scope.new = true;
				$scope.setTitle('Create a new offer');
				$scope.getLocations = function (query) {
					return places.getPlacePredictions({
						input: query,
						types: ['(cities)']
					});
				};

				// Presence is used in the template to lock fields
				$scope.provider = provider;
				$scope.service = service;

				$scope.offer = Offer.$cached({
					provider: provider,
					service: service
				});

				$scope.serviceSelectorFilter = offerServiceSelectorFilter;

				$scope.currencies = currency.currencyList;

				$scope.submit = function (form) {
					form.validate = function () {
						angular.forEach(form, function (field, key) {
							if (!key.match(/^\$/) && field.$validate) field.$validate();
						});
					};
					$scope.offer.$save().$then(function (resp) {
						// offer creation success!
						// Remove from cache
						Offer.$clearCached();
						// follow through by navigating to the offer
						$state.go('^.existing.view', { // Go to the offer
							id: resp.id
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
		})
		.state('offer.existing', {
			abstract: true,
			url: '/:id',
			template: '<ui-view />',
			resolve: {
				offer: ['Offer', '$stateParams', function (Offer, params) {
					let offer = Offer.$find(params.id);
					return offer.$asPromise();
				}]
			},
		})
		.state('offer.existing.view', {
			url: '',
			template: viewTemplate,
			controller: ['$scope', 'offer', '$modal', '$state', function ($scope, offer, $modal, $state) {
				let title = `${offer.service.name} - ${offer.location} - ${offer.provider.name}`;
				$scope.setTitle(title);
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
		.state('offer.existing.edit', {
			url: '/edit',
			template: editNewTemplate,
			controller: ['$scope', 'offer', '$state', 'currency', 'googlePlacesAutocomplete', function ($scope, offer, $state, currency, places) {
				$scope.edit = true;
				$scope.setTitle(offer.service.name + ' - ' + offer.location + ' - ' + offer.provider.name);
				$scope.offer = offer;
				$scope.getLocations = function (query) {
					return places.getPlacePredictions({
						input: query,
						types: ['(cities)']
					});
				};

				$scope.serviceSelectorFilter = offerServiceSelectorFilter;

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
						$state.go('^.view');
					}, function (response) {
						// Should only ever get here if theres a server-side validation error, which should always be checked on the client side. No need for an error message if this is the case. Get the client side right!
						form.validate();
					});
				};

				$scope.cancel = function () {
					$scope.offer.$restore();
					$state.go('^.view');
				};
			}]
		});
	}]);

function offerServiceSelectorFilter (service) {
	return service.status === 'published' && service.type === 'service';
}