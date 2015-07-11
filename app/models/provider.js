import angular from 'angular';
import 'angular-restmod';
import _ from 'lodash';

export default angular.module('ethiveProviderModel', [
	'restmod'
]).factory('Provider', ['restmod', function (restmod) {
	return restmod.model('/providers').mix({
		$config: {
			primaryKey: 'id'
		},
		offers: {
			hasMany: 'Offer'
		},
		isAdministeredBy: function isAdministeredBy(user) {
			return user.isLoggedIn() && _.some(this.admins, function (admin) {
				return admin === user._id || admin._id === user._id;
			});
		},
		/**
		 * Outputs a statically valid -- but not necessarily unique -- ID based on the currently assigned name.
		 */
		generateId: function () {
			this.id = (this.name || '').trim().toLowerCase().replace(/[^a-z0-9-\s]/g, '').replace(/\s+/g, '-');
		}
	});
}]);