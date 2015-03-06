import angular from 'angular';
import 'angular-ui-router';

import home from 'routes/home/home';
import 'routes/service/service';
import 'routes/service/new/new';
import 'routes/service/edit/edit';
import 'routes/provider/provider';
import 'routes/provider/new/new';
import 'routes/offer/offer';
import 'routes/login/login';
import 'routes/signup/signup';
import 'routes/signup/signup.failure';
import 'routes/account/account';

export default angular.module('ethiveRoutes', [
        'ui.router',
        home.name
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('service.newService', {
                url: '/new',
                templateUrl: 'routes/service/new/new.html',
                controller: 'CreateServiceCtrl'
            })
            .state('service.editService', {
                url: '/edit',
                templateUrl: 'routes/service/edit/edit.html',
                controller: 'EditServiceCtrl'
            })
            .state('provider.newProvider', {
                url: '/new'
            })
            .state('provider', {
                url: '/providers/:providerID',
                templateUrl: 'routes/provider/provider.html',
                controller: 'ProviderCtrl'
            })
            .state('offer', {
                url: '/providers/:providerID/offers/:offerID',
                templateUrl: 'routes/offer/offer.html',
                controller: 'OfferCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'routes/login/login.html',
                controller: 'LoginCtrl',
                params: {
                    next: {
                        // state: state to transition to after login
                        // params: state params for the next state
                    }
                }
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'routes/signup/signup.html',
                controller: 'SignupCtrl'
            })
            .state('signup.success', {
                url: '/success',
                templateUrl: 'routes/signup/signup.success.html'
            })
            .state('signup.failure', {
                url: '/failure',
                templateUrl: 'routes/signup/signup.failure.html',
                controller: 'SignupFailureCtrl'
            })
            .state('verifyEmailSuccess', {
                url: '/verifyEmailSuccess',
                templateUrl: 'routes/verifyEmail/verifyEmailSuccess.html'
            })
            .state('verifyEmailFailure', {
                url: '/verifyEmailFailure',
                templateUrl: 'routes/verifyEmail/verifyEmailFailure.html'
            })
            .state('account', {
                url: '/account',
                templateUrl: 'routes/account/account.html',
                controller: 'AccountCtrl'
            })
            .state('otherwise', {
                url: '*path',
                templateUrl: 'routes/not-found/not-found.html',
                controller: ['$rootScope', function ($rootScope) {
                    $rootScope.setTitle('Not found' + $rootScope.titleEnd);
                }]
            })
    }]).run([
        '$rootScope', function ($rootScope) {
            $rootScope.$on('$stateChangeError', function $stateChangeError(event, toState,
                toParams, fromState, fromParams, error) {
                console.group();
                console.error('$stateChangeError', error);
                console.error(error.stack);
                console.info('event', event);
                console.info('toState', toState);
                console.info('toParams', toParams);
                console.info('fromState', fromState);
                console.info('fromParams', fromParams);
                console.groupEnd();
            });
        }
    ]);