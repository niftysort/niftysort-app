
app.controller('mainCtrl', function(categoryService, graphService, $scope){
  console.log('main controller loaded!');

  categoryService.retrieveAllCategories()
  .then(function(resp) {
    $scope.categoryNames = resp.data.map(function(val) {
      return val.name;
    })
    console.log('Possible categories: ', $scope.categoryNames);
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

  $scope.autoFill= function(categoryInput) {

    // on right arrow key up
    if (event.keyCode === 39) {
      this.searchCategory = $scope.autoComplete;
    }

    if (categoryInput) {
      var filteredCategories = $scope.categoryNames.filter(function(val) {
        return val.slice(0, categoryInput.length) === categoryInput;
      });

      $scope.autoComplete = filteredCategories.sort()[0];
    } else {
      $scope.autoComplete = '';
    }
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
    topPoints.key = data.key;
    var size = topPoints.values.length;
    topPoints.values.forEach(function(val) {
      val.rating = val.y/maxY.y*slider + (1-(val.xR/maxX.xR))*(10-slider);
      val.size = val.rating;
      val.series = 0;
    })
    // console.log([topPoints]);
    $scope.data = [topPoints];
  //   $scope.data = [{
  //   key: 'Group 1',
  //   values: [{x: 3, y: 3, size: 2, shape: 'circle'}, {x: 2, y: 1, size: 5, shape: 'circle'},  {x: 1.5, y: 0.5, size: 3, shape: 'circle'}]
  // }];

    $scope.options = {
    chart: {
        type: 'scatterChart',
        height: '100%',
        color: d3.scale.category10().range(),
        scatter: {
            onlyCircles: false
        },
        dispatch: {
            renderEnd: function(e){
              // var renderedChart = angular.element(document.querySelector('.nvd3-svg'))[0];
              var renderedWidth = angular.element(document.querySelector('.nvd3-svg'))[0].clientWidth;
              // angular.element(document.querySelector('.nvd3-svg'))[0].css('height', renderedWidth);
              angular.element(document.querySelector('.nvd3-svg'))[0].style.height = renderedWidth;
              // console.log(test22);
            }
        },
        showDistX: false,
        showDistY: false,
        showXAxis: true,
        showYAxis: true,
        padData: true,
        padDataOuter: 0,
        showLegend: false,
        useInteractiveGuideline: true,
        // forceY: [0],

        tooltip: {
          contentGenerator: function(key, x, y, e) {
            console.log(key);
            return '<h3>Rating: ' + key.point.rating.toFixed(2) + '</h3><h4>Price: $' + key.point.xR + '</xR>'
          }
        },

        duration: 350,
        xAxis: {
            axisLabel: '',
            tickFormat: function(d){
              return '';
            }
        },
        yAxis: {
            axisLabel: '',
            tickFormat: function(d){
              return '';
            },
            axisLabelDistance: -5
        },
        zoom: {
            //NOTE: All attributes below are optional
            enabled: true,
            scaleExtent: [1, 10],
            useFixedDomain: false,
            useNiceScale: false,
            horizontalOff: false,
            verticalOff: false,
            unzoomEventType: 'dblclick.zoom'
        }
    }
  };

  }

 
  console.log($scope.data);

  

});
