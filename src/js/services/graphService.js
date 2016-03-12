
app.factory('graphService', function($http){

	return {

		// FIXME: attribute to be attributes
		retrieveGraphData: (category, attribute) => {
			return $http.get(`/v1/categories/${category}/${attribute}`);
		},

		assignPointProperties: (topProducts, maxX, maxY, numResults) => {
			var color = 0;

		    topProducts.forEach(function(val) {
		      val.rating = val.y/maxY.y*5 + (1-(val.xR/maxX.xR))*5;
		      val.marker = {};
		      val.marker.radius = val.rating * 3;
		      val.marker.fillColor = `rgb(${color},255,${color})`;
		      color += Math.round(200/numResults);
		    });

		    return topProducts;
		}

	}

})
