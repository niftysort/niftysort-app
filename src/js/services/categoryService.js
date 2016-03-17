
app.factory('categoryService', function($http) {

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
        if(window.innerWidth > 767){
          document.getElementById("category-query").focus();
        }
        else{
          document.getElementById("category-query-mobile").focus();
        }
      }, 50);
    },

    setCursorAttribute: () => {
    	setTimeout(function(){
        if(window.innerWidth > 767){
          document.getElementById("attributes-query").focus();
        }
        else{
          document.getElementById("attributes-query-mobile").focus();
        }
      }, 50);
    }

  }

});
