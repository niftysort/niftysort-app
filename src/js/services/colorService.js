app.factory('colorService', function() {
	return {
		getPathColor: i => {
			var selectedPointColor = document.getElementsByTagName("path")[i].getAttribute('fill');
	    var rgbArray = selectedPointColor.split(',').map(function(col) {
	      return col.replace(/[^0-9]/g, "");
	    });
	    var colorR = rgbArray[0] - 50;
	    var colorG = rgbArray[1] - 50;
	    var colorB = rgbArray[2];
	    return `rgb(${colorR},${colorG},${colorB})`;
		}
	}
})