import angular from 'angular';
import 'angular-restmod';
import _ from 'lodash';

export default angular.module('ethiveServiceModel', [
		'restmod'
	])
	.factory('Service', ['restmod', function (restmod) {
		return restmod.model('/services').mix({
			$config: {
				primaryKey: 'id'
			},
			parent: {
				belongsTo: 'Service',
				key: 'parentId'
			},
			children: {
				hasMany: 'Service'//,
				//key: 'childrenIds'
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
					hasAncestor: function (ancestor) {
						if (this.parent) {
							if (this.parent.id === (ancestor.id || ancestor)) {
								return true;
							}
							return this.parent.hasAncestor(ancestor);
						} else {
							return false;
						}
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
					}
				}
			}
		});
	}]);