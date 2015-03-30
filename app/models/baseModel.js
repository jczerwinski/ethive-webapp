import angular from 'angular';
import 'angular-restmod';
import 'angular-inflector';

export default angular.module('ethiveBaseModel', [
	'restmod',
	'platanus.inflector'
]).factory('EthiveBaseModel', ['restmod', 'inflector', function (restmod, inflector) {
	return restmod.mixin({
		$config: {
			// Suppress warning:
			// No API style base was selected, see the Api Integration FAQ for more information on this warning
			style: 'Mongoose', // By setting the style variable the warning is disabled.
		},
		$extend: {
				Model: {
					// Suppress warning:
					// Default paremeterization of urls will be disabled in 1.2, override Model.encodeUrlName with inflector.parameterize in your base model to keep the same behaviour
					encodeUrlName: inflector.parameterize
				}
			}
	});
}]);