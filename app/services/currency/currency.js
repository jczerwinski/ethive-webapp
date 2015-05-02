import _ from 'lodash';

export default angular.module('ethiveCurrency', []).factory('currency', ['$http', function ($http) {

	var URL = 'http://openexchangerates.org/api/currencies.json?app_id=9f55d699ea684dba9fa19a3491bd7557&callback=JSON_CALLBACK';

	var currencies;
	var currencyList;

	function getCurrencies () {
		return $http.jsonp(URL).then(function (resp) {
			return currencies = resp.data;
		});
	}

	function getCurrencyList () {
		return getCurrencies().then(function (currencies) {
			return currencyList = _.map(currencies, function (el, key) {
				return {
					code: key,
					name: el
				};
			});
		});
	}

	return {
		/**
		 * Provides a promise of an array of currency objects. Each object is of the form {code, name}, where code is an ISO currency code and name is a textual name of the currency
		 */
		currencyList: currencyList || getCurrencyList()
	};
}]);