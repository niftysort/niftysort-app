
app.factory('graphService', function($http, cardService, colorService){

	return {

		// FIXME: attribute to be attributes
		retrieveGraphData: (category, attribute) => {
			return $http.get(`/v1/categories/${category}/${attribute}`);
		},

		assignPointProperties: ({topProducts, maxX, maxY, desiredNumResults}) => {				
				let colorR = 255;
				let colorB = 157;
				let radius = 30;
				
		    topProducts.forEach( val => {
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
			let pointMod = products.filter( val => {
	    	return id == val.id;
	  	});
	    let pointColor = pointMod[0].marker.fillColor;
	    togglePointStroke(pointColor);
	    cardService.removeOutline();
	    cardService.addOutline(pointMod);
		},
		removePointStroke: () => {
			let paths = pathsDOM()
	    for (let i = 0; i < paths.length; i++) {
	      paths[i].classList.remove('hello');
	      document.getElementsByTagName("path")[i].setAttribute('stroke-width', '0');
	    }
		}
	}

	function togglePointStroke(pointColor) {
		let paths = pathsDOM()

    for (let i = 0; i < paths.length; i++) {
      paths[i].classList.remove('hello');
      document.getElementsByTagName("path")[i].setAttribute('stroke-width', '0');
    }

    for (let i = 0; i < paths.length; i++) {
      let selectedPointColor = document.getElementsByTagName("path")[i].getAttribute('fill');
      if (selectedPointColor === pointColor) {
        let rgb = colorService.getPathColor(i);
        document.getElementsByTagName("path")[i].setAttribute('stroke-width', '5');
        document.getElementsByTagName("path")[i].setAttribute('stroke', rgb);
      }
    }
	}

	function pathsDOM() {
		return document.getElementsByTagName("path");
	}

	removePointStroke

})
