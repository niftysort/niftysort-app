
app.controller('mainCtrl', function(categoryService, graphService, $scope){
  console.log('main controller loaded!');

  //FIXME: Do not delete, for later use

  // categoryService.retrieveAllCategories()
  // .then(function(data) {
  // 	$scope.allCategories = data;
  // }, function(err) {
  // 	console.log(err);
  // })

  // TODO: change from hardcoded to user input:
  $scope.foundCategory = {
    _id: '56da00ed51f20c82dbdfa761'
  };

  $scope.getCategory = function() {
    categoryService.retrieveCategory($scope.category)
    .then(function(data) {
    	// $scope.foundCategory = data;
    }, function(err) {
    	// $scope.foundCategory = null;
    	console.log(err);
    })
  }

  $scope.getGraph = function() {
  	graphService.retrieveGraph($scope.foundCategory._id, $scope.attribute)
  	.then(function(resp) {
  		$scope.data = resp.data;
  	}, function(err) {
  		$scope.data = null;
  		console.log('err ',err);
  	})
  }

  $scope.options = {
    chart: {
        type: 'scatterChart',
        height: 450,
        color: d3.scale.category10().range(),
        scatter: {
            onlyCircles: false
        },
        showDistX: true,
        showDistY: true,
      tooltipContent: function(d) {
         return d.series && '<h3>' + d.series[0].key + '</h3>';
      },
        duration: 350,
        xAxis: {
            axisLabel: 'X Axis',
            tickFormat: function(d){
                return d3.format('.02f')(d);
            }
        },
        yAxis: {
            axisLabel: 'Y Axis',
            tickFormat: function(d){
                return d3.format('.02f')(d);
            },
            axisLabelDistance: -5
        },
        zoom: {
            //NOTE: All attributes below are optional
            enabled: true,
            scaleExtent: [1, 10],
            useFixedDomain: false,
            useNiceScale: true,
            horizontalOff: false,
            verticalOff: false,
            unzoomEventType: 'dblclick.zoom'
        }
    }
  };

});
