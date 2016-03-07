var express = require('express');
var router = express.Router();

var Category = require('../models/category');
var Product = require('../models/product');

/* GET category */

// Get all categories
// Refactor the database query into the model
router.get('/', function(req, res, next) {
	Category.find({}, function(err, foundCategories) {
		if (err || !foundCategories) {
			return res.status(400).send(err || 'No Categories.');
		}
		return res.status(200).send(foundCategories);
	})
});

router.get('/:userQuery', function(req, res, next) {
	var categoryQuery = req.params.userQuery;
	Category.findOne({name:categoryQuery}, function(err, foundCategory) {
		if (err || !foundCategory) {
			return res.status(400).send(err || 'Category not found.');
		}
		return res.status(200).send(foundCategory);
	})
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

// FIXME: eventually make multiple attributes input acceptable
router.get('/:categoryId/:attributes', (req, res, next) => {
  var categoryId = req.params.categoryId;
  var attributes = req.params.attributes;

  Category.getD3DataByAttribute(categoryId, attributes, function(err, D3FormatedData) {
		if (err) {
			return res.status(400).send(err);
		}
		return res.status(200).send(D3FormatedData);
	});
})

module.exports = router;
