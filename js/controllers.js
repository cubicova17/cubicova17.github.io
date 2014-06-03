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
  			return month == $scope.currentMonth?'active':'';  			
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
  .controller('AttributeDetailsCtrl', ['$scope', '$resource', 'cohortioConstants', '$routeParams','monthService',
      function($scope, $resource, cohortioConstants, $routeParams, monthService) {

        $scope.data = decodeURIComponent($routeParams.data);
        $scope.sort = 'COUNT';
        $scope.funnel = 'COUNT,REQUEST,PAYMENT';
        $scope.attribute = $routeParams.attribute;
        $scope.dimension = $routeParams.dimension;        
        var SourceStats = $resource(cohortioConstants.URL_ROOT + '_ah/api/cohortiosourceraw/v1/get_stats_by_attribute/', {
            attribute:'@attribute', dimension: '@dimension', month: '@month', sort: '@sort', funnel: '@funnel', data: '@data'
          },{
              query: {
              method:'GET',
              isArray: false
          }
       });

        $scope.update = function(){
          if($scope.attribute == 'location' && $scope.data.indexOf('http://') != 0)
            $scope.data = 'http://' + $scope.data;
          var sourceStats = SourceStats.query({limit: 15,
            attribute: $scope.attribute,
            dimension: $scope.dimension,
            data: $scope.data,
            month: monthService.getMonth(),
            sort: $scope.sort,
            funnel: $scope.funnel
          });
          sourceStats.$promise.then(function (results) {
            $scope.sourceStats = results.items;
          });
        }             
        $scope.$watch('sort', function(newValue, oldValue) {
          if(newValue != oldValue){
            $scope.update();
          }
        });
        $scope.$watch(function () {
          return monthService.getMonth();
        }, function(newVal) {
          $scope.update();
        });
    }])
.controller('LocationCtrl', ['$scope', '$routeParams',
      function($scope, $routeParams) {

    }])
.controller('MenuCtrl', ['$scope', '$route', '$routeParams', '$location',
      function($scope, $route, $routeParams, $location) {
        var updateMenu = function(){ 
          var renderAction = $route.current.action;
          var renderPath = renderAction.split( "." );
          $scope.isDashboard = (renderPath[ 0 ] == "dashboard");
          $scope.isSources = (renderPath[ 0 ] == "sources");
        };
 
        $scope.$on(
          "$routeChangeSuccess",
          function( $currentRoute, $previousRoute ){
            updateMenu();
 
          }
        );


    }]);
// Как показали исследования метод ч есть у метод 

// 1.  Fu, K.S. Digital pattern recognition. Berlin: Springer Verlag, 1976.
// 2.  Christopher M. Bishop. Pattern recognition and machine learning. Boston: Kluwer Academic Publishers, 2006.
// 3.  Manning, Christopher , Hinrich Schütze. Foundations of Statistical Natural Language Processing. Cambridge, MA, USA. 1999. : MIT Press. pp. 388–402. ISBN 0-262-13360-1.
// 4.  W. Wang, V. Portnoy, and I. Pollak. A stochastic context-free grammar model for time series analysis. // In Proceedings of the IEEE International Conference on Acoustics, Speech, and Signal Processin. April 15-20, 2007. Pages III-1245--III-1248, Honolulu, HI.
// 5.  Ng Andrew, Coursera Machine Learning: https://www.coursera.org/course/ml
// 6.  Джон Хопкрофт, Раджив Мотвани, Джеффри Ульман. Контекстно-свободные грамматики и языки // Введение в теорию автоматов, языков и вычислений = Introduction to Automata Theory, Languages, and Computation. — М.: «Вильямс», 2002. — С. 528.  
// 7.  International Journal of Parallel Programming June 2014, Volume 42, Issue 3, pp 505-523. Parallel Training of An Improved Neural Network for Text Categorization. Cheng Hua Li, Laurence T. Yang, Man Lin
// 8.  Damian Eads, Karen Glocer, Simon Perkins, and James Theiler. Grammar-guided feature extraction for time series classiﬁcation. Technical Report LA-UR-05-4487, Los Alamos National Laboratory, MS D436, Los Alamos, NM, 87545, June 2005.
// 9.  Zan Huang, Dennis K. J. Lin.  The Time-Series Link Prediction Problem withApplications in Communication Surveillance // INFORMS Journal on Computing. Vol. 21, No. 2, Spring 2009, pp. 286–303
// 10. M. Sahami, S. Dumais, D. Heckerman, E. Horvitz. A Bayesian approach to filtering junk e-mail // AAAI'98 Workshop on Learning for Text Categorization. 1998.
// 11. Rosenblatt, F. The Perceptron: A Probalistic Model For Information Storage And Organization In The Brain. // Psychological Review 65 (6): 386–408. 1958. 
// 12. Bishop, C.M. Neural Networks for Pattern Recognition, Oxford: Oxford University Press. 1995.


