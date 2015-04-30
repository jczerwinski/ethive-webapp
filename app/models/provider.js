import angular from 'angular';
import 'angular-restmod';
import _ from 'lodash';

export default angular.module('ethiveProviderModel', [
	'restmod'
]).factory('Provider', ['restmod', function (restmod) {
	return restmod.model('/api/providers').mix({
		offers: {
			hasMany: 'Offer'
		},
		isAdministeredBy: function isAdministeredBy(user) {
			return user && user.username && _.some(this.admins, function (admin) {
				return admin.username === user.username;
			});
		}
	});
}]);