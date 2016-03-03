
app.controller('mainCtrl', function(categoryService, $scope){
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
  	
  }

});
