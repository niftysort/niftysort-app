var express = require('express');
var router = express.Router();

// var Category = require('../models/category');

/* GET category */

router.get('/:userQuery', function(req, res, next) {
	var categoryQuery = req.params.userQuery;

	Category.retrieveOne(categoryQuery, function(err, foundCategory) {
		if (err) {
			return res.status(400).send(err);
		}
		return res.status(200).send(foundCategory);
	});
});

//FIXME: Do not delete, for later use

router.get('/', function(req, res, next) {
	Category.retrieveAll(function(err, allCategories) {
		if (err) {
			return res.status(400).send(err);
		}
		return res.status(200).send(allCategories);
	})
})

router.get('/:categoryId/:attribute', function(req, res, next) {
	var categoryId = req.params.category;
	var attribute = req.params.attribute;

	Category.retrieveGraph(categoryId, attribute, function(err, graphData) {
		if (err) {
			return res.status(400).send(err);
		}
		return res.status(200).send(graphData);
	})
})

module.exports = router;