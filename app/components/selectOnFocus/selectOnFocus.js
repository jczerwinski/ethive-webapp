import angular from 'angular';

export default angular.module('ethiveSelectOnFocus', []).directive('selectOnFocus', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('focus', function () {
                this.select();
            });
        }
    };
}]);