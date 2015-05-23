import angular from 'angular';
import 'angular-restmod';

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
				belongsToMany: 'Service',
				key: 'childrenId'
			},
			$extend: {
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
					 * A service is published when it and all of its ancestors have `published` status.
					 * @return {Boolean}  Whether or not this service is published.
					 */
					/*

					BROKEN --- DO NOT USE. Service resources inline their children. These children do not have references to their parent. As such, recursing on parent DOES NOT WORK. Could maybe fix with custom hook to link children to parent manually on load?

					isPublished: function () {
					    var isPublished = (this.status === 'published');
					    return this.parent ? isPublished && this.parent.isPublished() : isPublished;
					},*/
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