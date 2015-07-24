import angular from 'angular';
import 'angular-restmod';

import currency from 'components/currency/currency';

export default angular.module('ethiveOfferModel', [
	'restmod',
	currency.name
]).factory('Offer', ['restmod', 'fxFilter', function (restmod, fxFilter) {
	return restmod.model('/offers').mix({
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
				raw.provider = this.provider.id;
			}
		},
		isAdministeredBy: function (user) {
			return this.provider.isAdministeredBy(user);
		},
		priceIn: function (currency) {
			return fxFilter(this.price.amount, this.price.currency, currency);
		}
	});
}]);