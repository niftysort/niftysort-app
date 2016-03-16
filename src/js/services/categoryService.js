
app.factory('categoryService', function($http){

  return {

    retrieveCategory: userQuery => {
      return $http.get('/v1/categories/'+ userQuery);
    },

    retrieveAllCategories: () => {
      return $http.get('/v1/categories');
    },

    clearInput: () => {
    	return '';
    },

    reset: () => {
    	return '';
    }

  }

});