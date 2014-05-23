'use strict';


// Declare app level module which depends on filters, and services
angular.module('cohortioApp', [
  'ngRoute',
  'ngResource',
  'cohortioApp.filters',
  'cohortioApp.services',
  'cohortioApp.directives',
  'cohortioApp.controllers'  
]).
config(['$routeProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/dashboard', {templateUrl: 'partials/user_template.html', controller: 'DashboardCtrl'});
  $routeProvider.when('/source/:source*/', {templateUrl: 'partials/source_details.html', controller: 'SourceDetailsCtrl'});
  $routeProvider.when('/sources', {templateUrl: 'partials/sources_template.html', controller: 'SourceCtrl'});  
  $routeProvider.otherwise({redirectTo: '/dashboard'});
}])
.constant('cohortioConstants', { 'URL_ROOT': 'https://silver-ripple-544.appspot.com/' });


