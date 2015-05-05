import angular from 'angular';
import fx from 'openexchangerates/money.js';
import _ from 'lodash';
export default angular.module('ethive.currency', [])
.factory('currency', ['CURRENCIES_DATA', 'RATES_DATA', function (currencies, rates) {
	return {
		currencies: currencies,
		currencyList: _.map(currencies, function (el, key) {
			return {
				code: key,
				name: el
			};
		}),
		ratesData: rates
	};
}])
.filter('fx',['currency', function (currency) {
	fx.base = currency.ratesData.base;
	fx.rates = currency.ratesData.rates;
	return function (amount, from, to) {
		return fx.convert(amount, {from: from, to: to});
	};
}]);