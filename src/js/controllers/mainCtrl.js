
app.controller('mainCtrl', function(category, $scope){
  console.log('main controller loaded!');

  $scope.getCategory = function(){
    $scope.foundCategory = category.find();
  }

});
