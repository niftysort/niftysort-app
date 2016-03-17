app.controller('mainCtrl', function(categoryService, graphService, productService, swalService, cardService, $scope){

  //SET NUM OF PLACHOLDER CARDS
  $scope.numOfPlacholders = 10;
  $scope.getPlaceholders = num => {
    return new Array(num);
  }

  //GET ALL CATEGORIES FROM BACKEND ON PAGE LOAD
  categoryService.retrieveAllCategories()
  .then( resp => {
    $scope.categoryNames = resp.data.map( val => {
      return val.name;
    })
    console.log('Possible categories: ', $scope.categoryNames);
  }, err => {
  	swalNoCategories();
  })

  //GET SPECIFIC CATEGORY FROM INPUT
  $scope.getCategory = searchCategory => {
    categoryService.retrieveCategory(searchCategory)
    .then( resp => {
      $scope.category = {
        id: resp.data._id,
        name: resp.data.name
      };
      categoryService.setCursorAttribute();

    }, err => {
    	$scope.category = null;
      // TODO: Handle error with UI, notify user that attribute is not recommended.
      // swalErrorAttribute()
      swalErrorCategory();
    })
  };

  $scope.newCategory = () => {
    $scope.category = categoryService.reset();
    $scope.searchCategory = categoryService.clearInput();
    $scope.autoComplete = '';
    $scope.attribute = '';
    $scope.products = productService.resetAll();
    $scope.topProducts = productService.resetTop();
    categoryService.setCursorCategory();
  }

  // ------------- *** for testing only *** --------------
  $scope.attributes = ["comfortable", "light", "heavy", "durable", "stylish", "sound", "loud", "noise", "wear", "ears"];
  // ------------- *** for testing only *** --------------

  function swalErrorCategory() {
    swalService.errorCategory();
    $scope.searchCategory = categoryService.clearInput();
  }

  function swalNoCategories() {
    swalService.noCategory();
  }

  //PASS OPTIONS TO HIGHCHARTS
  let chart = new Highcharts.Chart({
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
          pointFormatter() {
            let name = (this.name.length > 40) ? this.name.substring(0,40).trim() +'...' : name;
            let price = this.xR.toFixed(2)
            let rating = this.rating.toFixed(2);
            return `<h1><b>${name}</b></h1><br>Price: $${price} - Rating: <strong>${rating}</strong>`
          }
        },
        point: {
          events: {
            click() {
              let id = this.id;
              graphService.toggleSelected(id, $scope.topProducts);
              cardService.scrollTo(id);
            },
          }
        }
      }
    },
    series: [{}]
  });

  //MARKER AND CARD CLICK HANDLER
  $scope.renderTest = id => {
    graphService.toggleSelected(id, $scope.topProducts);
  }

  //get products of category from backend and send to cache
  $scope.getGraph = attribute => {
    $scope.attribute = attribute;
  	graphService.retrieveGraphData($scope.category.id, attribute)
  	.then( resp => {
      document.activeElement.blur(); //on iOS make keyboard hide
      graphService.removePointStroke();
      console.log(resp.data);
      cacheCategoryData(resp.data);
  	}, err => {
  		$scope.data = [];
  		console.log('err ',err);
  	})
  }

  $scope.autoFill = (keyCode, categoryInput) => {
    // on right arrow key up
    console.log(keyCode);
    if (keyCode === 39) {
      $scope.searchCategory = $scope.autoComplete;
      console.log($scope.autoComplete);
    }

    // Enter for Safari and Mobile
    if (keyCode === 13) {
      $scope.getCategory(categoryInput);
    }

    if (categoryInput) {
      let filteredCategories = $scope.categoryNames.filter( val => {
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
    let products = category.values;
    let productsInfo = getProductInfo(products);
    if (!productsInfo) return;
    let topProducts = graphService.assignPointProperties(productsInfo);
    $scope.topProducts = productService.removeHiddenCharacters(topProducts);
    renderGraph($scope.topProducts);
    initializeSlider(productsInfo.minX, productsInfo.maxX);
  }


  //ON SLIDER CHANGE TAKE IN SLIDER MIN MAX AND RE-CALC RANGE
  function getRangeTopProducts(minPrice, maxPrice) {
    chart.series[0].setData([{}]);
    let products = $scope.products;
    let productsInfo = getProductInfo(products, minPrice, maxPrice);
    let topProducts = graphService.assignPointProperties(productsInfo);
    $scope.topProducts = productService.removeHiddenCharacters(topProducts);
    renderGraph($scope.topProducts);
  }

  function getProductInfo(products, minPrice, maxPrice) {
    let permittedProducts = productService.removeZeroValueProducts(products);
    if (!permittedProducts.length) {
      swalService.badAttribute();
      $scope.attribute = $scope.prevAttribute;
      return null;
    }
    $scope.prevAttribute = $scope.attribute;
    console.log($scope.prevAttribute);
    let minX = productService.getMinX(permittedProducts);
    let maxX = productService.getMaxX(permittedProducts);
    let rangedProducts;
    if (minPrice && maxPrice) {
      rangedProducts = productService.getProductsInRange(permittedProducts, minPrice, maxPrice);
    } else {
      rangedProducts = productService.getProductsInRange(permittedProducts, minX.xR, maxX.xR);
    }

    let maxY = productService.getMaxY(permittedProducts);
    let sortedProductsByRating = productService.sortCachedData(rangedProducts, maxX, maxY);
    let desiredNumResults = (permittedProducts.length > 10) ? 10 : sortedProductsByRating.length;
    let topProducts = productService.getTopResults(sortedProductsByRating, desiredNumResults);

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
    $scope.slider = {
      min: minX.xR,
      max: maxX.xR,
      options: {
        step: 0.01,
        precision: 2,
        floor: minX.xR,
        translate(value) {
          return '$' + value.toFixed(2);
        },
        hideLimitLabels: false,
        disabled: false,
        minRange: 5,
        noSwitching: true,
        onEnd() {
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
