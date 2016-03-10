
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

//This is not a highcharts object. It just looks a little like one!

    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: 'Height Versus Weight of 507 Individuals by Gender'
        },
        subtitle: {
            text: 'Source: Heinz  2003'
        },
        xAxis: {
            title: {
                enabled: true,
                text: 'Height (cm)'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: 'Weight (kg)'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: false,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '',
                    pointFormat: '<b>{series.name}</b><br>{point.x} {point.name} cm, {point.y} kg'
                }
            }
        },
        series: [{
            name: 'Female',
            color: 'rgba(223, 83, 83, .5)',
            data: [{name:'penis',x: 3, y:0.8, marker: { radius: 20, color: 'black'}}, {name:'tanzy',x: 6, y:3, marker: { radius: 30}}, {x: -2, y:-4, marker: { radius: 60}}]
            
            }]
    });


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
      console.log(val);
    })
    // console.log([topPoints]);
    console.log(angular.element(document.querySelector('#chart-contain'))[0].innerHTML);
    angular.element(document.querySelector('#chart-contain'))[0].innerHTML = '<nvd3 options="options" data="data"></nvd3>';
    $scope.data = [];
    $scope.data = [topPoints];
  
  }

 
  console.log($scope.data);

  

});
