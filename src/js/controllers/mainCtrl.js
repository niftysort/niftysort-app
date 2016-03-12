
app.controller('mainCtrl', function(categoryService, graphService, productService, $scope){
  console.log('main controller loaded!');

  $scope.slider = {
    min: 0,
    max: 100,
    options: {
      floor: 0,
      ceil: 100,
      minRange: 10,
      noSwitching: true,
      onEnd: function() {
        getRangeTopProducts($scope.products, $scope.slider.min, $scope.slider.max);
      }
    }
  };

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
      };

      setTimeout(function(){
        document.getElementById("attributes-query").focus();
      }, 50);

    }, function(err) {
    	$scope.category = null;
    	console.log(err);
    })
  };

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
            var id = this.id;
            toggleSelected(id);
          },
        }
      }
    }
  },
  series: [{}]
});

  $scope.renderTest = function(id) {
    toggleSelected(id);
  }

  function toggleSelected(id) {
    var pointMod = $scope.topProducts.filter(function(val) {
      return id == val.id;
    });
    var pointColor = pointMod[0].marker.fillColor;
    toggleButtonHighlight(pointMod);
    togglePointHighlight(pointColor);
  }

  function toggleButtonHighlight(pointMod) {
    var products = document.getElementsByClassName('product-card');

    for (var i = 0; i < products.length; i++) {
      products[i].classList.remove('hola');
    }

    for (var i = 0; i < products.length; i++) {
      if (document.getElementsByClassName('product-card')[i].dataset.id == pointMod[0].id) {
        document.getElementsByClassName('product-card')[i].classList.add('hola');
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


  $scope.getGraph = function() {
  	graphService.retrieveGraphData($scope.category.id, $scope.attribute)
  	.then(function(resp) {
      cacheCategoryData(resp.data);
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


  function cacheCategoryData(category) {
    $scope.products = category.values;
    var products = category.values;

    var permittedProducts = removeZeroValueProducts(products);
    var maxX = getMaxX(permittedProducts);
    var minX = getMinX(permittedProducts);
    var maxY = getMaxY(permittedProducts);
    var sortedProductsByRating = sortCachedData(permittedProducts, maxX, maxY);

    // var desiredNumResults = (permittedProducts.length > 10) ? 10 : sortedProductsByRating.length;
    var desiredNumResults = permittedProducts.length;
    var topProducts = getTopResults(sortedProductsByRating, desiredNumResults);

    $scope.topProducts = assignPointProperties(topProducts, maxX, maxY, desiredNumResults);

    renderGraph($scope.topProducts);
    initializeSlider(minX, maxX);
  }

  function getRangeTopProducts(products, minPrice, maxPrice) {
    $scope.topProducts = [];
    chart.series[0].setData([{}]);
    console.log(minPrice, maxPrice);
    var permittedProducts = removeZeroValueProducts(products);
    var rangedProducts = getProductsInRange(permittedProducts, minPrice, maxPrice);
    var maxX = getMaxX(permittedProducts);
    var maxY = getMaxY(permittedProducts);
    var sortedProductsByRating = sortCachedData(rangedProducts, maxX, maxY);
    // var desiredNumResults = (permittedProducts.length > 10) ? 10 : sortedProductsByRating.length;
    var desiredNumResults = permittedProducts.length;

    var topProducts = getTopResults(sortedProductsByRating, desiredNumResults);

    $scope.topProducts = assignPointProperties(topProducts, maxX, maxY, desiredNumResults);

    renderGraph($scope.topProducts);
  }

  function initializeSlider(minX, maxX) {
    $scope.slider.min = minX.xR;
    $scope.slider.max = maxX.xR;
    $scope.slider.options.floor = minX.xR;
    $scope.slider.options.ceil = maxX.xR;
  }

  function removeZeroValueProducts(products) {
    return products.filter(function(val) {
      return val.xR;
    });
  }

  function getMaxX(products) {
    return products.reduce(function(prev, curr) {
      return (prev.xR >= curr.xR) ? prev : curr;
    });
  }

  function getMinX(products) {
    return products.reduce(function(prev, curr) {
      return (prev.xR <= curr.xR) ? prev : curr;
    });
  }

  function getMaxY(products) {
    return products.reduce(function(prev, curr) {
      return (prev.y >= curr.y) ? prev : curr;
    });
  }

  function sortCachedData(products, maxX, maxY) {
    return products.sort(function(a,b) {
      return ( b.y/maxY.y*5 + (1-(b.xR/maxX.xR))*(5) ) - ( a.y/maxY.y*5 + (1-(a.xR/maxX.xR))*(5) )
    });
  }

  function getTopResults(sortedProducts, numResults) {
    // return sortedProducts.slice(0, 10);
    return sortedProducts;
  }

  function assignPointProperties(topProducts, maxX, maxY, numResults) {
    var color = 0;

    topProducts.forEach(function(val) {
      val.rating = val.y/maxY.y*5 + (1-(val.xR/maxX.xR))*5;
      val.marker = {};
      val.marker.radius = val.rating * 3;
      val.marker.fillColor = `rgb(${color},255,${color})`;
      color += Math.round(200/numResults);
    });

    return topProducts;
  }

  function renderGraph(products) {
    chart.series[0].setData(products);
  }

  function getProductsInRange(permitProducts, minPrice, maxPrice) {
    return permitProducts.filter(function(val) {
      return (val.xR >= minPrice && val.xR <= maxPrice);
    });
  }

});
