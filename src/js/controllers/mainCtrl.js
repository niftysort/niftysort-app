
app.controller('mainCtrl', function(categoryService, graphService, $scope){
  console.log('main controller loaded!');

  //FIXME: Do not delete, for later use

  // categoryService.retrieveAllCategories()
  // .then(function(data) {
  // 	$scope.allCategories = data;
  // }, function(err) {
  // 	console.log(err);
  // })


  $scope.getCategory = function() {
    categoryService.retrieveCategory($scope.category)
    .then(function(data) {
    	$scope.foundCategory = data;
    }, function(err) {
    	$scope.foundCategory = null;
    	console.log(err);
    })
  }

  $scope.getGraph = function() {
  	graphService.retrieveGraph($scope.foundCategory._id, $scope.attribute)
  	.then(function(data) {
  		$scope.graphData = data;
  	}, function(err) {
  		$scope.graphData = null;
  		console.log(err);
  	}
  }

});
