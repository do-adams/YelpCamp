const express = require('express');
const router = express.Router();

const Campground = require('../models/campground');

// INDEX AND CREATE ROUTES

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

// SHOW ROUTE

router.get('/:id', (req, res) => {
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
		if (err) { 
			console.log(err); 
		}	else { 
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});
});

// UPDATE ROUTES

router.get('/:id/edit', (req, res) => {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			res.render('campgrounds/edit', {campground: foundCampground});
		}
	});
});

router.put('/:id', (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

// DESTROY ROUTE

router.delete('/:id', (req, res) => {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds');
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