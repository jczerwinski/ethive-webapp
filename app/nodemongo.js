/**
 * API Bound Models for AngularJS
 * @version v1.1.3 - 2014-09-25
 * @link https://github.com/angular-platanus/restmod
 * @author Ignacio Baixas <ignacio@platan.us>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function(angular, undefined) {
'use strict';

angular.module('restmod').factory('NodeMongo', ['restmod', function(restmod) {

	return restmod.mixin('DefaultPacker', { // include default packer extension
		$config: {
			style: 'NodeMongo',
			primaryKey: '_id'
		}
	});

}]);})(angular);