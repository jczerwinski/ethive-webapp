import angular from 'angular';
import 'angular-restmod';
import _ from 'lodash';

export default angular.module('ethiveProviderModel', [
	'restmod'
]).factory('Provider', ['restmod', function (restmod) {
	return restmod.model('/providers').mix({
		offers: {
			hasMany: 'Offer'
		},
		isAdministeredBy: function isAdministeredBy(user) {
			return user.isLoggedIn() && _.some(this.admins, function (admin) {
				return admin === user._id || admin._id === user._id;
			});
		}
	});
}]);