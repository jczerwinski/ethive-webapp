'use strict';

angular.module('ethiveApp')
    .controller('NewOfferCtrl', function ($scope, $modalInstance, Provider, $state, Service, provider, service, $http) {
        if (provider) {
            $scope.provider = provider;
            $scope.newOffer = provider.offers.$build();
        } else {
            $scope.newOffer = Offer.$build();
        }

        $scope.locationOptions = {
            types: '(cities)'
        };

        // TODO Proxy this call, set up as a service.
        $http.jsonp('http://openexchangerates.org/api/currencies.json?app_id=9f55d699ea684dba9fa19a3491bd7557&callback=JSON_CALLBACK').success(function(data) {
            $scope.currencies = $.map(data, function(el, key) {
                return {
                    code: key,
                    name: el
                };
            });
        });

        $scope.submit = function(form) {
            form.validate = function() {
                angular.forEach(form, function(field, key) {
                    if (!key.match(/^\$/) && field.$validate) field.$validate();
                });
            };
            $scope.newOffer.$save().$then(function(resp) {
                console.log(resp);
                // offer creation success!
                // close modal and navigate back to the last page, refreshed:
                $scope.cancel();

                // Where we go should be provided by the caller. If not provided, default to the offer we've just created. Normally, we're only likely to come from a Provider, so doing back to the provider likely makes the most sense.
                if (provider) { 
                    $state.go('provider', { // Go back to the provider
                        providerID: provider._id
                    });
                } else {
                    $state.go('offer', { // Go to the offer
                        offerID: resp[0]._id
                    });
                }
            }, function(response) {
                // Should only ever get here if theres a server-side validation error, which should always be checked on the client side. No need for an error message if this is the case. Get the client side right!
                form.validate();
            });
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    });