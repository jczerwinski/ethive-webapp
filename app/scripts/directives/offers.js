.directive('offerList', function () {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			offers: '=offers'
		},
		templateUrl: 'views/offerTable.html'
	};
});