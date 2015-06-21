import angular from 'angular';
import Offer from 'models/offer';
import 'angular-ui-router';
import 'luisfarzati/angulartics';

export default angular.module('ethiveReferRoute', [
	'ui.router',
	'angulartics',
	Offer.name
]).config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('refer', {
		url: '/refer'
	}).state('refer.offer', {
		url: '/offer/:id'
	})
}]).run(['$rootScope', 'Offer', '$analytics', function ($rootScope, Offer, $analytics) {
	$rootScope.$on('$stateChangeStart', function (event, state, params) {
		if (state.name === 'refer.offer') {
			event.preventDefault();
			Offer.$find(params.id).$then(function (offer) {
				window.location.replace(offer.landing);
				$analytics.eventTrack('Billable Click', {
					category: offer.provider.id,
					label: 'https://www.ethive.com/offers/' + offer.id,
					value: offer.service.commission || 0
				})
			});
		}
	})
}]);