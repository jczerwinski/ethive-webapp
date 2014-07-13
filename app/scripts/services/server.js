angular.module('ethiveApp')
.factory('server', [$resource, function ($resource) {
	var Provider = $resource('http://localhost:3000/api/providers/' + $stateParams.providerID);
		$scope.provider = Provider.get();
}]);