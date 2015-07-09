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
}]).run(['$rootScope', 'Offer', '$analytics', '$window', function ($rootScope, Offer, $analytics, $window) {
	$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
		if (toState.name === 'refer.offer') {
			event.preventDefault();
			Offer.$find(toParams.id).$then(function (offer) {
				// TODO Doesn't work properly if the landing page is bad. Going "back" after a bad redirect skips the referring page. :(
				// See https://github.com/jczerwinski/ethive-webapp/issues/120
				$window.location.replace(offer.landing);
				$analytics.eventTrack('Billable Click', {
					category: offer.provider.id,
					label: 'https://www.ethive.com/offers/' + offer.id,
					value: offer.service.commission || 0
				})
			});
		}
	})
}]);