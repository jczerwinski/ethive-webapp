import angular from 'angular';
import 'angular-restmod';
import 'angular-inflector';

import config from 'app-config';

export default angular.module('ethiveBaseModel', [
	'restmod',
	'platanus.inflector',
	config.name
]).factory('EthiveBaseModel', ['restmod', 'inflector', 'config', function (restmod, inflector, config) {
	return restmod.mixin({
		$config: {
			// Suppress warning:
			// No API style base was selected, see the Api Integration FAQ for more information on this warning
			style: 'Mongoose', // By setting the style variable the warning is disabled.,
			urlPrefix: config.apiRoot
		},
		$extend: {
				Model: {
					// Suppress warning:
					// Default paremeterization of urls will be disabled in 1.2, override Model.encodeUrlName with inflector.parameterize in your base model to keep the same behaviour
					encodeUrlName: inflector.parameterize,
					// Build and save a new model on this service. Useful for maintaining form state between controller instantiation and destruction.
					$cached: function (init) {
						if (this.$$cached) {
							return this.$$cached.$extend(init);
						} else {
							this.$$cached = this.$build(init);
							return this.$$cached;
						}
					},
					$clearCached: function () {
						delete this.$$cached;
					}
				}
			}
	});
}]);