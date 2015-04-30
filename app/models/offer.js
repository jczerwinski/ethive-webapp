import angular from 'angular';
import 'angular-restmod';

export default angular.module('ethiveOfferModel', [
	'restmod'
]).factory('Offer', ['restmod', function (restmod) {
	return restmod.model('/api/offers').mix({
		provider: {
			hasOne: 'Provider'
		},
		service: {
			hasOne: 'Service'
		},
		$hooks: {
			// see https://github.com/platanus/angular-restmod/issues/234
			'before-render': function (raw) {
				raw.service = this.service.id;
			}
		},
		isAdministeredBy: function (user) {
			return this.provider.isAdministeredBy(user);
		}
	});
}]);