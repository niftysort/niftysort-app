
app.factory('graphService', function($http, cardService, colorService){

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
		},

		//FIND MARKER ONCE CLICKED, HIGHLIGHT BOTH CARD AND MARKER
		toggleSelected: (id, products) => {
			console.log('toggle');
			var pointMod = products.filter(function(val) {
	      return id == val.id;
	    });
	    console.log(pointMod);
	    var pointColor = pointMod[0].marker.fillColor;
	    togglePointStroke(pointColor);
	    cardService.toggleOutline(pointMod);
		}
	}

	function togglePointStroke(pointColor) {
		var paths = document.getElementsByTagName("path");

    for (var i = 0; i < paths.length; i++) {
      paths[i].classList.remove('hello');
      document.getElementsByTagName("path")[i].setAttribute('stroke-width', '0');
    }

    for (var i = 0; i < paths.length; i++) {
      var selectedPointColor = document.getElementsByTagName("path")[i].getAttribute('fill');
      if (selectedPointColor === pointColor) {
        var rgb = colorService.getPathColor(i);
        document.getElementsByTagName("path")[i].setAttribute('stroke-width', '5');
        document.getElementsByTagName("path")[i].setAttribute('stroke', rgb);
      }
    }
	}

})
