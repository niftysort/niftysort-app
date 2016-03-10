
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
    console.log(this);
    categoryService.retrieveCategory($scope.searchCategory)
    .then(function(resp) {
      $scope.category = {
        id: resp.data._id,
        name: resp.data.name
      }
      // angular.element(document).find('#attributes-query')
      // angular.element( document.querySelector( '#attributes-query' ) )[0].focus();

      setTimeout(function(){
        document.getElementById("attributes-query").focus();
      }, 50);

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
    text: null
  },
  subtitle: {
    text: null
  },
  xAxis: {
    visible: false,
    title: {
      enabled: true,
      text: 'Height (cm)'
    },
    startOnTick: true,
    endOnTick: true,
    showLastLabel: true
  },
  yAxis: {
    visible: false,
    title: {
      text: 'Weight (kg)'
    }
  },
  legend: {
    enabled: false,
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
            enabled: true
          }
        }
      },
      tooltip: {
        headerFormat: '',
        pointFormat: '<b>{point.name}</b><br>${point.xR} , Rating: {point.rating}'
      },
      point: {
        events: {
          click: function() {
            var asinNum = this.asin;
            toggleSelected(asinNum);
          },
        }
      }
    }
  },
  series: [{}]
});

  $scope.renderTest = function() {
    var asinNum = event.target.dataset['asin'];
    toggleSelected(asinNum);
  }

  function toggleSelected(asinNum) {
    var pointMod = $scope.data[0].values.filter(function(val) {
      return asinNum == val.asin;
    });
    var pointColor = pointMod[0].marker.fillColor;
    toggleButtonHighlight(pointMod);
    togglePointHighlight(pointColor);
  }

  function toggleButtonHighlight(pointMod) {
    var buttons = document.getElementsByClassName('asinButton');

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('hola');
    }

    for (var i = 0; i < buttons.length; i++) {
      if (document.getElementsByClassName('asinButton')[i].dataset.asin == pointMod[0].asin) {
        document.getElementsByClassName('asinButton')[i].classList.add('hola');
      }
    }
  }

  function togglePointHighlight(pointColor) {
    var paths = document.getElementsByTagName("path");

    for (var i = 0; i < paths.length; i++) {
      paths[i].classList.remove('hello');
      // document.getElementsByTagName("path")[i].setAttribute('stroke-width', '2');
    }

    for (var i = 0; i < paths.length; i++) {
      if (document.getElementsByTagName("path")[i].getAttribute('fill') === pointColor) {
        document.getElementsByTagName("path")[i].classList.add('hello');
        // document.getElementsByTagName("path")[i].setAttribute('stroke-width', '2');
      }
    }
  }


// v------------ Leave for testing purposes (fake data and chart responsive) ----------------v

// $scope.changeData = function() {
//   console.log('test');
//   chart.series[0].setData([{name:'penis',x: -3, y:0.8, marker: { radius: 10, color: 'black'}}, {name:'tanzy',x: -6, y:1, marker: { radius: 30}}, {x: -2, y:-4, marker: { radius: 60}}], true)
// }

// ^------------ Leave for testing purposes (fake data and chart responsive) ----------------^


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
    var color = 0;
    var asin = 10;
    // var radius = 3;
    topPoints.values.forEach(function(val) {
      val.rating = val.y/maxY.y*slider + (1-(val.xR/maxX.xR))*(10-slider);
      val.marker = {};

      val.marker.radius = val.rating * 3;
      val.marker.fillColor = `rgb(${color},255,${color})`;
      val.asin = asin;
      asin += 10;
      color += Math.round(200/numResults);
    })
    $scope.data = [topPoints];
    chart.series[0].setData($scope.data[0].values);
  }
});
