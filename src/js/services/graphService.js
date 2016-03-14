
app.factory('graphService', function($http){

	return {

		// FIXME: attribute to be attributes
		retrieveGraphData: (category, attribute) => {
			return $http.get(`/v1/categories/${category}/${attribute}`);
		},

		assignPointProperties: ({topProducts, maxX, maxY, desiredNumResults}) => {				
				var colorR = 255;
				var colorB = 157;
				var radius = 30;
				
		    topProducts.forEach(function(val) {
		      val.rating = val.y/maxY.y*5 + (1-(val.xR/maxX.xR))*5;
		      val.marker = {};
		      val.marker.radius = radius;
		      val.marker.fillColor = `rgb(${colorR},159,${colorB})`;
		      colorR -= Math.round(61/desiredNumResults);
		      colorB += Math.round(64/desiredNumResults);
		      radius -= Math.round(21/desiredNumResults);

		    });

		    return topProducts;
		}

	}

})
