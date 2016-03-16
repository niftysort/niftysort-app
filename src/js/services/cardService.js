app.factory('cardService', function(colorService) {
	return {
		scrollTo: id => {
			if(window.innerWidth > 768){
	      var offset = 340;
	    }else{
	      var offset = 460;
	    }
	    var $targetElem = $('div').find(`[data-id="${id}"]`)
	    $("body, html").animate({scrollTop: $targetElem.offset().top - offset}, "slow");
		},

		toggleOutline: pointMod => {
			var products = document.getElementsByClassName('product-card');

	    for (var i = 0; i < products.length; i++) {
	      document.getElementsByClassName('product-card')[i].style.outline = '';
	    }

	    for (var i = 0; i < products.length; i++) {
	      if (document.getElementsByClassName('product-card')[i].dataset.id == pointMod[0].id) {
	        var rgb = colorService.getPathColor(products.length - 1 - i);
	        document.getElementsByClassName('product-card')[i].style.outline = '5px solid ' + rgb;
	      }
	    }
		}


	}
})