
import deferredBootstapper from 'philippd/bower-angular-deferred-bootstrap';
import app from './app';

var CURRENCIES_URL = 'http://openexchangerates.org/api/currencies.json?app_id=9f55d699ea684dba9fa19a3491bd7557&callback=JSON_CALLBACK';
var RATES_URL = 'http://openexchangerates.org/api/latest.json?app_id=9f55d699ea684dba9fa19a3491bd7557&callback=JSON_CALLBACK';

deferredBootstapper.bootstrap({
	element: document.documentElement,
	module: app.name,
	bootstrapConfig: {
		strictDi: true
	},
	moduleResolves: [
		{
			module: 'ethive.currency',
			resolve: {
				CURRENCIES_DATA: ['$http', function ($http) {
					return $http.jsonp(CURRENCIES_URL).then(function (resp) {
						return resp.data;
					});
				}],
				RATES_DATA: ['$http', function ($http) {
					return $http.jsonp(RATES_URL).then(function (resp) {
						return resp.data;
					});
				}]
			}
		}
	]
});