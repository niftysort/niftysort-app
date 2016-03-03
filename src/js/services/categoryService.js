
app.factory('categoryService', function($http){

  return {

    retrieveCategory: function(userQuery) {

      // if(userQuery === "headphones") {
      //   return {
      //     data: {
      //       name: 'Headphones',
      //       suggested: ['lightweight', 'loud', 'durable', 'fashionable']
      //     }
      //   }
      // } else {
      //   return {
      //     err: 'Error!'
      //   }
      // }

      //TODO: Set up back end to receive get request

      return $http.get('/v1/categories/'+ userQuery);
    },

    retrieveAllCategories: function() {
      return $http.get('/v1/categories');
    }

    
  }

})
