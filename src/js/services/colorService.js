app.factory('colorService', function() {
	return {
		getPathColor: i => {
			let selectedPointColor = document.getElementsByTagName("path")[i].getAttribute('fill');
	    let rgbArray = selectedPointColor.split(',').map( col => {
	      return col.replace(/[^0-9]/g, "");
	    });
	    let colorR = rgbArray[0] - 50;
	    let colorG = rgbArray[1] - 50;
	    let colorB = rgbArray[2];
	    return `rgb(${colorR},${colorG},${colorB})`;
		}
	}
})