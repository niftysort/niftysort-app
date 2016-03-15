
app.controller('mainCtrl', function(categoryService, graphService, productService, $scope){
  console.log('main controller loaded!');


  //SET NUM OF PLACHOLDER CARDS
  $scope.numOfPlacholders = 10;
  $scope.getPlaceholders = function(num){
    return new Array(num);
  }


  // ASSIGN SLIDER OPTIONS

  //GET ALL CATEGORIES FROM BACKEND ON PAGE LOAD
  categoryService.retrieveAllCategories()
  .then(function(resp) {
    $scope.categoryNames = resp.data.map(function(val) {
      return val.name;
    })
    console.log('Possible categories: ', $scope.categoryNames);
  }, function(err) {
  	swalNoCategories();
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
      // TODO: Handle error with UI, notify user that attribute is not recommended.
      // swalErrorAttribute()
      swalErrorCategory();
    })
  };

  function swalErrorCategory() {
    swal({
      title: "Category Not Available",
      text: "Please check back a little later!"
    })
    $scope.searchCategory = '';
  }

  function swalNoCategories() {
    swal({
      title: "Hmm Something Went Wrong",
      text: "Don't worry, we're on, try back a little later!"
    })
  }

//PASS OPTIONS TO HIGHCHARTS
var chart = new Highcharts.Chart({
  chart: {
    renderTo: 'container',
    type: 'scatter',
    zoomType: ''
  },
  credits: {
    enabled: false
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
    if(window.innerWidth > 768){
      var offset = 340;
    }else{
      var offset = 460;
    }
    var $targetElem = $('div').find(`[data-id="${id}"]`)
    $("body").animate({scrollTop: $targetElem.offset().top - offset}, "slow");
  }

  //remove class hola from all product cards and add only to correct card
  function toggleButtonHighlight(pointMod) {
    var products = document.getElementsByClassName('product-card');

    for (var i = 0; i < products.length; i++) {
      document.getElementsByClassName('product-card')[i].style.outline = '';
    }

    for (var i = 0; i < products.length; i++) {
      if (document.getElementsByClassName('product-card')[i].dataset.id == pointMod[0].id) {
        var rgb = getPathColor(products.length - 1 - i);
        document.getElementsByClassName('product-card')[i].style.outline = '5px solid ' + rgb;
      }
    }
  }

  function togglePointHighlight(pointColor) {
    var paths = document.getElementsByTagName("path");

    for (var i = 0; i < paths.length; i++) {
      paths[i].classList.remove('hello');
      document.getElementsByTagName("path")[i].setAttribute('stroke-width', '0');
    }

    for (var i = 0; i < paths.length; i++) {
      var selectedPointColor = document.getElementsByTagName("path")[i].getAttribute('fill');
      if (selectedPointColor === pointColor) {
        var rgb = getPathColor(i);
        document.getElementsByTagName("path")[i].setAttribute('stroke-width', '5');
        document.getElementsByTagName("path")[i].setAttribute('stroke', rgb);
      }
    }

    
  }

  function getPathColor(i) {
    var selectedPointColor = document.getElementsByTagName("path")[i].getAttribute('fill');
    var rgbArray = selectedPointColor.split(',').map(function(col) {
      return col.replace(/[^0-9]/g, "");
    });
    var colorR = rgbArray[0] - 50;
    var colorG = rgbArray[1] - 50;
    var colorB = rgbArray[2];
    return `rgb(${colorR},${colorG},${colorB})`;
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

    var topProducts = graphService.assignPointProperties(productsInfo);

    $scope.topProducts = productService.removeHiddenCharacters(topProducts);

    renderGraph($scope.topProducts);
    initializeSlider(productsInfo.minX, productsInfo.maxX);
  }


  //ON SLIDER CHANGE TAKE IN SLIDER MIN MAX AND RE-CALC RANGE
  function getRangeTopProducts(minPrice, maxPrice) {
    chart.series[0].setData([{}]);
    var products = $scope.products;
    var productsInfo = getProductInfo(products, minPrice, maxPrice);

    var topProducts = graphService.assignPointProperties(productsInfo);

    $scope.topProducts = productService.removeHiddenCharacters(topProducts);

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

    $scope.slider = {
      min: minX.xR,
      max: maxX.xR,
      options: {
        step: 0.01,
        precision: 2,
        floor: minX.xR,
        translate: function(value) {
          return '$' + value.toFixed(2);
        },
        hideLimitLabels: false,
        disabled: false,
        minRange: 5,
        noSwitching: true,
        // rightToLeft: true,
        onEnd: function() {
          getRangeTopProducts($scope.slider.min, $scope.slider.max);
        }
      }
    };
    
  }

  function renderGraph(products) {
    chart.series[0].setData(products, false);
    chart.redraw();
  }

});
