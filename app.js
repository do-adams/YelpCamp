'use strict';

const express = require('express'),
	app = express(),
	path = require('path'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	User = require('./models/user'),
	seedDB = require('./seeds');

mongoose.connect('mongodb://localhost/yelp_camp');
seedDB();

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

app.get('/', (req, res) => {
	res.render('landing');
});

app.get('/campgrounds', (req, res) => {
	Campground.find({}, function(err, campgrounds) {
		if (err) { 
			console.log(err);
		} else { 
			res.render('campgrounds/index', {campgrounds: campgrounds});
		}
	});
});

app.post('/campgrounds', (req, res) => {
	const name = req.body.name,
		image = req.body.image, 
		desc = req.body.description;

	const newCampground = {name: name, image: image, description: desc};

	Campground.create(newCampground, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/campgrounds');
		}
	});
});

app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new');
});

app.get('/campgrounds/:id', (req, res) => {
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
		if (err) { 
			console.log(err); 
		}	else { 
			console.log(foundCampground);
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});
});

// ===================
// COMMENTS ROUTES
// ===================

app.get('/campgrounds/:id/comments/new', (req, res) => {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
		} else { 
			res.render('comments/new', {campground: campground});
		}
	});
});

app.post('/campgrounds/:id/comments', (req, res) => {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

app.listen(3000, () => 
	console.log('The YelpCamp Server has started!'));