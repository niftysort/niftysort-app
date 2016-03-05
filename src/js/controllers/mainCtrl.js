
app.controller('mainCtrl', function(categoryService, graphService, $scope){
  console.log('main controller loaded!');

  //FIXME: Do not delete, for later use

  categoryService.retrieveAllCategories()
  .then(function(resp) {
  	$scope.allCategories = resp.data;
  }, function(err) {
  	console.log(err);
  })

  $scope.pickCategory = function() {
    $scope.category = {
      id: this.value._id,
      name: this.value.name
    }
  }

  $scope.getCategory = function() {
    categoryService.retrieveCategory($scope.category)
    .then(function(data) {
    	// $scope.foundCategory = data;
    }, function(err) {
    	// $scope.foundCategory = null;
    	console.log(err);
    })
  }

  // $scope.getGraph = function() {
  // 	graphService.retrieveGraph($scope.category.id, $scope.attribute)
  // 	.then(function(resp) {
  //     if ($scope.data) {
  //       $scope.data.push(resp.data);
  //     } else {
  //       $scope.data = [resp.data];
  //     }
  // 	}, function(err) {
  // 		$scope.data = [];
  // 		console.log('err ',err);
  // 	})
  // }


    graphService.retrieveGraph('56d9ecfe3c90686bd0557e61', 'red')
    .then(function(resp) {
      if ($scope.data) {
        $scope.data.push(resp.data);
      } else {

        sortByRatingAndPrice(resp);
        
        
      }
    }, function(err) {
      $scope.data = [];
      console.log('err ',err);
    })

    function sortByRatingAndPrice(resp) {
      var numResults = 8;
      resp.data.values.sort(function(a,b) {
        return b.y - a.y
      });
      // console.log(resp.data.values);
      var topPoints = {};
      topPoints.values = resp.data.values.slice(0, numResults);
      scaleByRating(topPoints);
    }

    function scaleByRating(topPoints) {
      console.log(topPoints.values);
      var size = topPoints.values.length;
      console.log(size);
      topPoints.values.forEach(function(val) {
        val.size += size;
        console.log(val);
        size--;
      })
      console.log(topPoints);

      $scope.data = [topPoints];
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
        showXAxis: true,
        showYAxis: true,
        padData: true,
        padDataOuter: 1,
        showLegend: false,
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
