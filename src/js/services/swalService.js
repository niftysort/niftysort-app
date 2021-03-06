app.factory('swalService', function() {
	return {
		errorCategory: () => {
			swal({
	      title: "Category Not Available",
	      text: "Please check back a little later!"
	    })
		},

		noCategory: () => {
			swal({
	      title: "Hmm Something Went Wrong",
	      text: "Don't worry, we're on, try back a little later!"
	    })
		},

		badAttribute: () => {
			swal({
	      title: "Not Enough Data For That Attribute",
	      text: "Please Try A Different Attribute"
	    })
		}
	}
})