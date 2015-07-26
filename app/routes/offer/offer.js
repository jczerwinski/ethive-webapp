import angular from 'angular';
import 'angular-ui-router';
import 'angular-bootstrap';

import 'chieffancypants/angular-hotkeys';

import currency from 'components/currency/currency';
import googlePlacesAutocomplete from 'components/google-places-autocomplete/google-places-autocomplete';
import OfferModel from 'models/offer';
import ProviderModel from 'models/provider';

import editNewTemplate from './editNew.html!text';
import viewTemplate from './view.html!text';
import confirmDeleteTemplate from 'components/confirmDeleteModal/confirmDelete.html!text';

// Used in template
import serviceBreadcrumbs from 'components/serviceBreadcrumbs/serviceBreadcrumbs';
import ServiceSelectorSearch from 'components/serviceSelectorSearch/serviceSelectorSearch';

export default angular.module('ethiveOfferRoute', [
		'ui.router',
		'ui.bootstrap',
		'cfp.hotkeys',
		OfferModel.name,
		ProviderModel.name,
		currency.name,
		googlePlacesAutocomplete.name,
		ServiceSelectorSearch.name,
		serviceBreadcrumbs.name
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
					// If a Service is pre-populated, go back to the Service's page on cancel
					if (service) {
						return $state.go('service.existing.view', {
							service: service,
							serviceID: service.id
						})
					}
					// If a Provider is pre-populated
					if (provider) {
						// Otherwise, go back to the Provider's page
						return $state.go('provider.existing.view', {
							provider: provider,
							providerID: provider.id
						});
					}
					// Otherwise, go home
					return $state.go('home');
				};
			}]
		})
		.state('offer.existing', {
			abstract: true,
			url: '/:offerID',
			params: {
				offer: null
			},
			resolve: {
				offer: ['Offer', '$stateParams', function (Offer, $stateParams) {
					if ($stateParams.offer) {
						return $stateParams.offer;
					}
					if ($stateParams.offerID) {
						return Offer.$find($stateParams.offerID).$asPromise();
					}
				}]
			},
			template: '<ui-view />'
		})
		.state('offer.existing.view', {
			url: '',
			template: viewTemplate,
			controller: ['$scope', 'offer', '$modal', '$state', 'hotkeys', function ($scope, offer, $modal, $state, hotkeys) {
				let title = `${offer.service.name} - ${offer.location} - ${offer.provider.name}`;
				$scope.setTitle(title);
				$scope.offer = offer;

				hotkeys.bindTo($scope).add({
					combo: 'p',
					description: 'Navigate to this offer\'s provider',
					callback: function (event) {
						event.preventDefault();
						$state.go('provider.existing.view', {providerID: offer.provider.id});
					}
				}).add({
					combo: 'e',
					description: 'Edit this offer',
					callback: function (event) {
						event.preventDefault();
						$state.go('^.edit');
					}
				});

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
			controller: ['$scope', 'offer', '$state', 'currency', 'googlePlacesAutocomplete', 'hotkeys', function ($scope, offer, $state, currency, places, hotkeys) {
				$scope.edit = true;
				hotkeys.bindTo($scope).add({
					combo: 'esc',
					description: 'Cancel editing this offer',
					callback: function (event) {
						event.preventDefault();
						$state.go('^.view');
					},
					allowIn: ['INPUT']
				});
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