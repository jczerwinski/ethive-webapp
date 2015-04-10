import angular from 'angular';
import 'angular-restmod';

export default angular.module('ethiveOfferModel', [
	'restmod'
]).factory('Offer', ['restmod', function (restmod) {
	return restmod.model('/api/offers').mix({
		provider: {
			hasOne: 'Provider'
		},
		isAdministeredBy: function (user) {
			return this.provider.isAdministeredBy(user);
		}
	});
}]);