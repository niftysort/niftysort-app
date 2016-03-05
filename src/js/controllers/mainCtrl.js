
app.controller('mainCtrl', function(categoryService, graphService, $scope){
  console.log('main controller loaded!');

  //FIXME: Do not delete, for later use

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
    console.log($scope.category.id);
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

    graphService.retrieveGraph('56d9ecfe3c90686bd0557e61', 'red')
    .then(function(resp) {
      if ($scope.data) {
        $scope.data.push(resp.data);
      } else {
        // resp.data.values.sort(function(a, b) {
        //   return b.x - a.x;
        // })
        // console.log(resp.data);
        // var size = 98;
        // resp.data.values.forEach(function(val) {
        //   val.size += size;
        //   size = size / 3;
        // })
        // resp.data.values[0].size = 7;
        // resp.data.values[3].size = 1400;
        $scope.data = [resp.data];
      }
    }, function(err) {
      $scope.data = [];
      console.log('err ',err);
    })




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
        pointShape: 'circle',
        // pointSize: 0.5,
        // showDistX: false,
        // showDistY: false,
        // showXAxis: false,
        // showYAxis: false,
      tooltipContent: function(d) {
         return d.series && '<h3>' + d.series[0].key + '</h3>';
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
