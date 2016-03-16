app.factory('cardService', function(colorService) {
	return {
		scrollTo: id => {
			let offset;
			if(window.innerWidth > 768){
	      offset = 340;
	    }else{
	      offset = 460;
	    }
	    let $targetElem = $('div').find(`[data-id="${id}"]`)
	    $("body, html").animate({scrollTop: $targetElem.offset().top - offset}, "slow");
		},

		toggleOutline: pointMod => {
			let products = document.getElementsByClassName('product-card');

	    for (let i = 0; i < products.length; i++) {
	      document.getElementsByClassName('product-card')[i].style.outline = '';
	    }

	    for (let i = 0; i < products.length; i++) {
	      if (document.getElementsByClassName('product-card')[i].dataset.id == pointMod[0].id) {
	        let rgb = colorService.getPathColor(products.length - 1 - i);
	        document.getElementsByClassName('product-card')[i].style.outline = '5px solid ' + rgb;
	      }
	    }
		}


	}
})