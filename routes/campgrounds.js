const express = require('express');
const router = express.Router();

const Campground = require('../models/campground');

router.get('/', (req, res) => {
	Campground.find({}, function(err, campgrounds) {
		if (err) { 
			console.log(err);
		} else { 
			res.render('campgrounds/index', {campgrounds: campgrounds});
		}
	});
});

router.post('/', isLoggedIn, (req, res) => {
	const name = req.body.name,
		image = req.body.image, 
		desc = req.body.description;

	const newCampground = {
		name: name, 
		image: image, 
		description: desc,
		author: {
			id: req.user._id,
			username: req.user.username
		}
	};

	Campground.create(newCampground, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/campgrounds');
		}
	});
});

router.get('/new', isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});

router.get('/:id', (req, res) => {
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
		if (err) { 
			console.log(err); 
		}	else { 
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/login');
	}
}

module.exports = router;