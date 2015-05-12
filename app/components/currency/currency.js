import angular from 'angular';
import fx from 'openexchangerates/money.js';
import _ from 'lodash';
import countries from 'OpenBookPrices/country-data/data/countries.json!json';

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
}])
.filter('localeCurrency', [function () {
	// Get map of country codes to currency codes
	var countryCurrencies = _.reduce(countries, function (countryCurrencies, country) {
		countryCurrencies[country.alpha2] = country.currencies[0];
		return countryCurrencies;
	}, {});
	// Filter function. Maps a locale string to a currency code
	return function (locale) {
		// locale eg: en_us
		return countryCurrencies[locale.slice(3).toUpperCase()];
	}
}]);