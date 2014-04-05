'use strict';

angular.module('healthhiveApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about/patients', {
        templateURL: 'views/about/patients.html',
        controller: ''
      })
      .otherwise({
        redirectTo: '/'
      });
  });
