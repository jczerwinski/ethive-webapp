import angular from 'angular';

export default angular.module('ethiveSelectOnFocus', []).directive('selectOnFocus', ['$timeout', function ($timeout) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			element.on('focus', function () {
				var self = this;
				$timeout(function () {
					self.select();
				})
			});
		}
	};
}]);