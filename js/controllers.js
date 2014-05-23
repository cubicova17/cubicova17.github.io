'use strict';

/* Controllers */

angular.module('cohortioApp.controllers', [])
  .controller('DashboardCtrl', ['$scope','$resource', 'cohortioConstants','monthService', function($scope, $resource, cohortioConstants, monthService) {
 	var Event = $resource(cohortioConstants.URL_ROOT + '_ah/api/cohortioraw/v1/cohortiorawevent/:eventId', {eventId:'@id'},{
		 query: {
	    	method:'GET',
	    	isArray: false
		}
	});
 	
 	var Source = $resource(cohortioConstants.URL_ROOT + '_ah/api/cohortiosourceraw/v1/cohortiosource/:sourceId', {sourceId:'@id'},{
		 query: {
	    	methods:'GET',
	    	isArray: false
		}
	});

 	$scope.update = function(){
		var events = Event.query({limit: 10, month: monthService.getMonth()});

    	events.$promise.then(function (results) {
   			$scope.results = results.items;
		});
	
	};
	$scope.$watch(function () {
       return monthService.getMonth();
     },                       
      function(newVal, oldVal) {
    	$scope.update();
    }, true);    
  }])
  .controller('MonthCtrl', ['$scope','monthService', function($scope, monthService) {
  		$scope.selectMonth = function(month){
  			monthService.selectMonth(month);
  			//DashboardCtrl.update();
  		}
  		$scope.$watch(function () {
       		return monthService.getMonth();
     	}, function(newVal) {
    		$scope.currentMonth = newVal;
    	});
  		$scope.isActive = function(month){
  			if(month == $scope.currentMonth){
  				return 'active';
  			}else{
  				return '';
  			}
  		}

  }])
  .controller('SourceCtrl', ['$scope','$resource', 'cohortioConstants','monthService', function($scope, $resource, cohortioConstants, monthService) {
 	
 	var Source = $resource(cohortioConstants.URL_ROOT + '_ah/api/cohortiosourceraw/v1/cohortiosource/:sourceId', {sourceId:'@id'},{
		 query: {
	    	method:'GET',
	    	isArray: false
		}
	});


		var sources = Source.query({limit: 15 });
		sources.$promise.then(function (results) {
   			$scope.sources = results.items;
		});
    
  }])
  .controller('SourceDetailsCtrl', ['$scope', '$resource', 'cohortioConstants', '$routeParams','monthService',
  function($scope, $resource, cohortioConstants, $routeParams, monthService) {
    $scope.source = decodeURIComponent($routeParams.source);
    $scope.sort = 'counter';

    var SourceStats = $resource(cohortioConstants.URL_ROOT + '_ah/api/cohortiosourceraw/v1/get_stats/?source=:source&month=:month&sort=:sort', 
    	{
    		source:'@source', month: '@month', sort: '@sort'
    	},{
		 query: {
	    	method:'GET',
	    	isArray: false
		}
	});

    $scope.update = function(){
    	var sourceStats = SourceStats.query({limit: 15, source: $scope.source, month: monthService.getMonth(), sort: $scope.sort  });
		sourceStats.$promise.then(function (results) {
   			$scope.sourceStats = results.items;
		});
    }
	
	$scope.update();
  	
  	$scope.$watch('sort', function(newValue, oldValue) {
             if(newValue != oldValue){
				$scope.update();
             }
        });
  }]);

  // http://youtu.be/wJ34Sbp_euQ
