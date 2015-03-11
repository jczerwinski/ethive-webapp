import angular from 'angular';
import 'angular-ui-router';
import _ from 'lodash';

import OfferModel from 'models/offer';

export default angular.module('ethiveNewOfferRoute', [
        'ui.router',
        OfferModel.name
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('provider.newOffer', {
            url: '/offers/new',
            templateUrl: 'routes/provider/newOffer/newOffer.html',
            controller: ['$rootScope', '$scope', '$state', 'provider', '$http', function ($rootScope, $scope, $state, provider, $http) {

                $rootScope.setTitle('Create a new offer');

                $scope.provider = provider;
                $scope.newOffer = provider.offers.$build();

                $scope.options = {
                    location: {
                        types: '(cities)'
                    },
                    display: function (service) {
                        // published services are selectable
                        if (service.status === 'published' && service.type === 'service') {
                            return 'select';
                        }
                        // published categories are displayed
                        if (service.status === 'published' && service.type === 'category') {
                            return 'display';
                        }
                        // Hide anything else.
                        return 'hide';
                    }
                };

                // TODO Proxy this call, set up as a service.
                $http.jsonp('http://openexchangerates.org/api/currencies.json?app_id=9f55d699ea684dba9fa19a3491bd7557&callback=JSON_CALLBACK').success(function(data) {
                    $scope.currencies = _.map(data, function(el, key) {
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
                        // offer creation success!
                        // follow through by navigating to the offer
                        $state.go('offer', { // Go to the offer
                            offerID: resp[0]._id
                        });
                    }, function(response) {
                        // Should only ever get here if theres a server-side validation error, which should always be checked on the client side. No need for an error message if this is the case. Get the client side right!
                        form.validate();
                    });
                };

                $scope.cancel = function() {
                    $state.go('^');
                };
            }]
        });
    }]);