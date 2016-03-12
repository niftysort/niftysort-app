
app.controller('mainCtrl', function(categoryService, graphService, productService, $scope){
  console.log('main controller loaded!');

  // ASSIGN SLIDER OPTIONS
  $scope.slider = {
    min: 0,
    max: 100,
    options: {
      floor: 0,
      ceil: 100,
      minRange: 10,
      noSwitching: true,
      onEnd: function() {
        getRangeTopProducts($scope.slider.min, $scope.slider.max);
      }
    }
  };


  //GET ALL CATEGORIES FROM BACKEND ON PAGE LOAD
  categoryService.retrieveAllCategories()
  .then(function(resp) {
    $scope.categoryNames = resp.data.map(function(val) {
      return val.name;
    })
    console.log('Possible categories: ', $scope.categoryNames);
  }, function(err) {
  	console.log(err);
  })

  //GET SPECIFIC CATEGORY FROM INPUT
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

//PASS OPTIONS TO HIGHCHARTS
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


  //MARKER AND CARD CLICK HANDLER
  $scope.renderTest = function(id) {
    toggleSelected(id);
  }

  //FIND MARKER ONCE CLICKED, HIGHLIGHT BOTH CARD AND MARKER
  function toggleSelected(id) {
    var pointMod = $scope.topProducts.filter(function(val) {
      return id == val.id;
    });
    var pointColor = pointMod[0].marker.fillColor;
    toggleButtonHighlight(pointMod);
    togglePointHighlight(pointColor);
  }

  //remove class hola from all product cards and add only to correct card
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

  //remove hola from all markers that aren't selected then add to correct one
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

  //get products of category from backend and send to cache
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


  //only invoked upon attribute query, output is scope.products and scope.topProducts
  function cacheCategoryData(category) {
    $scope.products = category.values;
    var products = category.values;
    var productsInfo = getProductInfo(products);
    
    $scope.topProducts = graphService.assignPointProperties(productsInfo.topProducts, productsInfo.maxX, productsInfo.maxY, productsInfo.desiredNumResults);

    renderGraph($scope.topProducts);
    initializeSlider(productsInfo.minX, productsInfo.maxX);
  }


  //ON SLIDER CHANGE TAKE IN SLIDER MIN MAX AND RE-CALC RANGE
  function getRangeTopProducts(minPrice, maxPrice) {
    chart.series[0].setData([{}]);
    var products = $scope.products;
    var productsInfo = getProductInfo(products, minPrice, maxPrice);

    $scope.topProducts = graphService.assignPointProperties(productsInfo.topProducts, productsInfo.maxX, productsInfo.maxY, productsInfo.desiredNumResults);

    renderGraph($scope.topProducts);
  }

  function getProductInfo(products, minPrice, maxPrice) {
    var info = {};

    info.permittedProducts = productService.removeZeroValueProducts(products);
    info.minX = productService.getMinX(info.permittedProducts);
    info.maxX = productService.getMaxX(info.permittedProducts);

    if (minPrice && maxPrice) {
      info.rangedProducts = productService.getProductsInRange(info.permittedProducts, minPrice, maxPrice);
    } else {
      info.rangedProducts = productService.getProductsInRange(info.permittedProducts, info.minX.xR, info.maxX.xR);
    }

    info.maxY = productService.getMaxY(info.permittedProducts);
    info.sortedProductsByRating = productService.sortCachedData(info.rangedProducts, info.maxX, info.maxY);
    info.desiredNumResults = info.permittedProducts.length;
    // var desiredNumResults = (permittedProducts.length > 10) ? 10 : sortedProductsByRating.length;
    info.topProducts = productService.getTopResults(info.sortedProductsByRating, info.desiredNumResults);  

    return info;
  }

  function initializeSlider(minX, maxX) {
    $scope.slider.min = minX.xR;
    $scope.slider.max = maxX.xR;
    $scope.slider.options.floor = minX.xR;
    $scope.slider.options.ceil = maxX.xR;
  }

  function renderGraph(products) {
    chart.series[0].setData(products, false);
    chart.redraw();
  }

});
