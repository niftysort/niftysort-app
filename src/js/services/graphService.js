
app.factory('graphService', function($http){

	return {

		// FIXME: attribute to be attributes
		retrieveGraphData: function(category, attribute) {
			return $http.get(`/v1/categories/${category}/${attribute}`);
		}

	}

})
