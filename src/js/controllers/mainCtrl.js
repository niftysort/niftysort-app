
app.controller('mainCtrl', function(categoryService, graphService, productService, $scope, $anchorScroll, $location){
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
        pointFormatter: function() {
          var name = (this.name.length > 40) ? this.name.substring(0,40).trim() +'...' : name;
          var price = this.xR.toFixed(2)
          var rating = this.rating.toFixed(2);
          return `<h1><b>${name}</b></h1><br>Price: $${price} - Rating: <strong>${rating}</strong>`
        }
      },
      point: {
        events: {
          click: function() {
            var id = this.id;
            toggleSelected(id);
            goToProduct(id);
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

  function goToProduct(id) {
    console.log('scroll');
    var newHash = id;
      $location.hash(id);
      $anchorScroll();
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
    }

    for (var i = 0; i < paths.length; i++) {
      if (document.getElementsByTagName("path")[i].getAttribute('fill') === pointColor) {
        document.getElementsByTagName("path")[i].classList.add('hello');
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
    
    $scope.topProducts = graphService.assignPointProperties(productsInfo);
    
    renderGraph($scope.topProducts);
    
    setTimeout(function() {
      initializeSlider(productsInfo.minX, productsInfo.maxX);
    }, 100)
  }


  //ON SLIDER CHANGE TAKE IN SLIDER MIN MAX AND RE-CALC RANGE
  function getRangeTopProducts(minPrice, maxPrice) {
    chart.series[0].setData([{}]);
    var products = $scope.products;
    var productsInfo = getProductInfo(products, minPrice, maxPrice);

    $scope.topProducts = graphService.assignPointProperties(productsInfo);

    renderGraph($scope.topProducts);
  }

  function getProductInfo(products, minPrice, maxPrice) {
    var permittedProducts = productService.removeZeroValueProducts(products);
    var minX = productService.getMinX(permittedProducts);
    var maxX = productService.getMaxX(permittedProducts);

    if (minPrice && maxPrice) {
      var rangedProducts = productService.getProductsInRange(permittedProducts, minPrice, maxPrice);
    } else {
      var rangedProducts = productService.getProductsInRange(permittedProducts, minX.xR, maxX.xR);
    }

    var maxY = productService.getMaxY(permittedProducts);
    var sortedProductsByRating = productService.sortCachedData(rangedProducts, maxX, maxY);
    var desiredNumResults = (permittedProducts.length > 10) ? 10 : sortedProductsByRating.length;
    var topProducts = productService.getTopResults(sortedProductsByRating, desiredNumResults);  

    return {
      desiredNumResults,
      maxX,
      maxY,
      minX,
      permittedProducts,
      rangedProducts,
      sortedProductsByRating,
      topProducts
    };
  }

  function initializeSlider(minX, maxX) {
    console.log(minX, maxX);
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

app.run(function($anchorScroll) {
  $anchorScroll.yOffset = 320;   // always scroll by 50 extra pixels
})
