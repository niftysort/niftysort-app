
app.controller('mainCtrl', function(categoryService, graphService, $scope){
  console.log('main controller loaded!');

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


    graphService.retrieveGraph('56d9ecfe3c90686bd0557e61', 'taste')
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
      var numResults = 10;
      var slider = 5;

      var maxX = resp.data.values.reduce(function(prev, curr) {
        return (prev.xR > curr.xR) ? prev : curr;
      });

      var maxY = resp.data.values.reduce(function(prev, curr) {
        return (prev.y > curr.y) ? prev : curr;
      }); 

      resp.data.values.sort(function(a,b) {
        return ( b.y/maxY.y*slider + (1-(b.xR/maxX.xR))*(10-slider) ) - ( a.y/maxY.y*slider + (1-(a.xR/maxX.xR))*(10-slider) )
      });

      var topPoints = {};
      topPoints.values = resp.data.values.slice(0, numResults);
      var size = topPoints.values.length;
      topPoints.values.forEach(function(val) {
        val.rating = val.y/maxY.y*slider + (1-(val.xR/maxX.xR))*(10-slider);
        val.size = val.rating;
      })
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
        showDistX: false,
        showDistY: false,
        showXAxis: false,
        showYAxis: false,
        padData: true,
        padDataOuter: 0,
        showLegend: false,
        useInteractiveGuideline: false,
        // forceY: [0],

        tooltip: {
          contentGenerator: function(key, x, y, e) {
            return '<h3>Rating: ' + key.point.rating.toFixed(2) + '</h3><h4>Price: $' + key.point.xR + '</xR>'
          }
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
