'use strict';

/* Filters */

angular.module('cohortioApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }])
  .filter('ngEncodeURI', function() {
  return encodeURIComponent;
});;
