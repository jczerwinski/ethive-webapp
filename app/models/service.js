import angular from 'angular';
import 'angular-restmod';
import _ from 'lodash';

export default angular.module('ethiveServiceModel', [
	'restmod'
]).factory('Service', ['restmod', function (restmod) {
	return restmod.model('/services').mix({
		$config: {
			primaryKey: 'id'
		},
		parent: {
			belongsTo: 'Service',
			key: 'parentId'
		},
		children: {
			hasMany: 'Service'
		},
		$extend: {
			Scope: {
				$forest: function () {
					return this.$search().$on('after-request', function (raw) {
						var index = _.reduce(raw.data, function (index, service) {
							index[service._id] = service;
							return index;
						}, {});
						raw.data = _.filter(raw.data, function (service) {
							if (service.parentId) {
								var parent = index[service.parentId];
								// Service is a child -- attach it to its parent.
								if (angular.isArray(parent.children)) {
									parent.children.push(service);
								} else {
									parent.children = [service];
								}
								return false
							}
							return true;
						});
					});
				}
			},
			Record: {
				equals: function (service) {
					return this._id === service._id;
				},
				hasAncestor: function (service) {
					return this.parent && (service.equals(this.parent) || this.parent.hasAncestor(service));
				},
				isAdministeredBy: function () {
					// admins array is only attached to server response if user is an admin
					return !!this.admins;
				},
				/**
				 * Returns the root service of this service, with this service's ancestor tree on the `parent` attribute inverted onto the `children` attribute. Only this service's ancestors and children will be present in the tree.
				 */
				invert: function () {
					if (this.parent) {
						this.parent.children = [this];
						return this.parent.invert();
					}
					// We're at the root.
					return this;
				},
				/**
				 * Outputs a statically valid -- but not necessarily unique -- ID based on the currently assigned name.
				 */
				generateId: function () {
					this.id = (this.name || '').trim().toLowerCase().replace(/[^a-z0-9-\s]/g, '').replace(/\s+/g, '-');
				},
				canDelete: function () {
					return this.type === 'service' && this.offers.length === 0 || this.type === 'category' && this.children.length === 0;
				}
			}
		}
	});
}]);