import angular from 'angular';
// See https://developers.google.com/maps/documentation/javascript/reference#AutocompleteService for API
export default angular.module('googlePlacesAutocomplete', [])
.service('googlePlacesAutocomplete', ['$window', function ($window) {
	let acs = new $window.google.maps.places.AutocompleteService();
	let sc = $window.google.maps.places.PlacesServiceStatus;
	return {
		getPlacePredictions: function (request) {
			return new Promise(function (resolve, reject) {
				try {
					acs.getPlacePredictions(request, function (results, status) {
						if (status === sc.OK) {
							resolve(results);
						} else {
							reject(status);
						}
					});
				} catch (err) {
					return reject(err);
				}
			});
		}
	};
}]);