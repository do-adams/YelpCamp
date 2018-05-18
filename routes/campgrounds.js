'use strict';

const express = require('express');
const router = express.Router();

const Campground = require('../models/campground'),
	Comment = require('../models/comment');
const middleware = require('../middleware');

// INDEX AND CREATE ROUTES

router.get('/', (req, res, next) => {
	Campground.find({}, function(err, campgrounds) {
		if (err) { 
			return next(err);
		} else if (!campgrounds) {
			return next(new Error('No campgrounds were found'));
		} else { 
			res.render('campgrounds/index', {campgrounds: campgrounds});
		}
	});
});

router.post('/', middleware.isLoggedIn, (req, res, next) => {
	const name = req.body.name,
		price = req.body.price,
		image = req.body.image, 
		desc = req.body.description;

	const newCampground = {
		name: name, 
		price: price,
		image: image, 
		description: desc,
		author: {
			id: req.user._id,
			username: req.user.username
		}
	};

	Campground.create(newCampground, function(err, newlyCreated) {
		if (err) {
			return next(err);
		} 
			res.redirect('/campgrounds');
	});
});

router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});

// SHOW ROUTE

router.get('/:id', (req, res, next) => {
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
		if (err) { 
			return next(err);
		} else if (!foundCampground) {
			return next(new Error('Could not find Campground'));
		}	else { 
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});
});

// UPDATE ROUTES

router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res, next) => {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {
			return next(err);
		} else if (!foundCampground) {
			return next(new Error('Could not find campground'));
		} else {
			res.render('campgrounds/edit', {campground: foundCampground});
		}
	});
});

router.put('/:id', middleware.checkCampgroundOwnership, (req, res, next) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if (err) {
			return next(err);
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

// DESTROY ROUTE

router.delete('/:id', middleware.checkCampgroundOwnership, (req, res, next) => {
	Campground.findByIdAndRemove(req.params.id, function(err, foundCampground) {
		if (err) {
			return next(err);
		} else if (!foundCampground) {
			return next(new Error('Could not find campground'));
		} else {
			// Delete campground comments
			foundCampground.comments.forEach(id => {
				Comment.findByIdAndRemove(id, function(err) {
					if (err) {
						return next(err);
					}
				});
			});
		}
		res.redirect('/campgrounds');
	});
});

module.exports = router;