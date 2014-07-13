angular.module('ethiveApp')
.controller('LoginCtrl', function ($scope, $http) {
	$scope.submit = function () {
		// Try to authenticate
		$http.post('/api/login', {
			email: $scope.email, 
			password: $scope.password
		}).then(function (response) {
			console.log(response)
		}, function (error) {});
	};
});

/*angular.module('ethiveApp').factory('Auth', ['$cookieStore', '$http', function (Base64, $cookieStore, $http) {
    // initialize to whatever is in the cookie, if anything
    $http.defaults.headers.common['Authorization'] = 'Basic ' + $cookieStore.get('authdata');
 
    return {
        setCredentials: function (username, password) {
            var encoded = Base64.encode(username + ':' + password);
            $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
            $cookieStore.put('authdata', encoded);
        },
        clearCredentials: function () {
            document.execCommand("ClearAuthenticationCache");
            $cookieStore.remove('authdata');
            $http.defaults.headers.common.Authorization = 'Basic ';
        }
    };
}]);*/