'use strict';
angular.module('ethiveApp')
.controller('OfferCtrl', function ($scope, $stateParams, $resource) {
	var Offer = $resource('/api/providers/:providerID/offers/:offerID');
	$scope.offer = Offer.get({providerID: $stateParams.providerID, offerID: $stateParams.offerID});
});