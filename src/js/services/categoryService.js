
app.factory('categoryService', function($http){

  return {

    retrieveCategory: function(userQuery) {
      return $http.get('/v1/categories/'+ userQuery);
    },

    retrieveAllCategories: function() {
      return $http.get('/v1/categories');
    }

  }

});