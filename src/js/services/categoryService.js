
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
    },

    setCursorCategory: () => {
      setTimeout(function(){
        document.getElementById("category-query").focus();
      }, 50);
    },

    setCursorAttribute: () => {
    	setTimeout(function(){
        document.getElementById("attributes-query").focus();
      }, 50);
    }

  }

});