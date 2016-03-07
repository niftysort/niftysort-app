
app.controller('mainCtrl', function(categoryService, graphService, $scope){
  console.log('main controller loaded!');

  categoryService.retrieveAllCategories()
  .then(function(resp) {
    var categoryNames = resp.data.map(function(val) {
      return val.name;
    })
    console.log('Possible categories: ', categoryNames);
  }, function(err) {
  	console.log(err);
  })

  $scope.getCategory = function() {
    categoryService.retrieveCategory($scope.searchCategory)
    .then(function(resp) {
      $scope.category = {
        id: resp.data._id,
        name: resp.data.name
      }
    }, function(err) {
    	$scope.category = null;
    	console.log(err);
    })
  }

  $scope.getGraph = function() {
  	graphService.retrieveGraph($scope.category.id, $scope.attribute)
  	.then(function(resp) {
      sortByRatingAndPrice(resp.data);
  	}, function(err) {
  		$scope.data = [];
  		console.log('err ',err);
  	})
  }

  function sortByRatingAndPrice(data) {
    var numResults = 10;
    var slider = 5;

    var maxX = data.values.reduce(function(prev, curr) {
      return (prev.xR > curr.xR) ? prev : curr;
    });

    var maxY = data.values.reduce(function(prev, curr) {
      return (prev.y > curr.y) ? prev : curr;
    });

    data.values.sort(function(a,b) {
      return ( b.y/maxY.y*slider + (1-(b.xR/maxX.xR))*(10-slider) ) - ( a.y/maxY.y*slider + (1-(a.xR/maxX.xR))*(10-slider) )
    });

    var topPoints = {};
    topPoints.values = data.values.slice(0, numResults);
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
        showDistX: true,
        showDistY: true,
        showXAxis: true,
        showYAxis: true,
        padData: true,
        padDataOuter: 0,
        showLegend: false,
        useInteractiveGuideline: false,
        // forceY: [0],

        tooltip: {
          contentGenerator: function(key, x, y, e) {
            console.log(key);
            return '<h3>Rating: ' + key.point.rating.toFixed(2) + '</h3><h4>Price: $' + key.point.xR + '</xR>'
          }
        },

        duration: 350,
        xAxis: {
            axisLabel: 'Price',
            tickFormat: function(d){
              return d3.format('.02f')(d);
            }
        },
        yAxis: {
            axisLabel: 'Attribute Match Index',
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
