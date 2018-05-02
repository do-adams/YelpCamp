'use strict';

const express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	Campground = require('./models/campground'),
	seedDB = require('./seeds');

mongoose.connect('mongodb://localhost/yelp_camp');
seedDB();

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	res.render('landing');
});

app.get('/campgrounds', (req, res) => {
	Campground.find({}, function(err, campgrounds) {
		if (err) console.log(err);
		else res.render('index', {campgrounds: campgrounds});
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
	res.render('new');
});

app.get('/campgrounds/:id', (req, res) => {
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
		if (err) { 
			console.log(err); 
		}	
		else { 
			console.log(foundCampground);
			res.render('show', {campground: foundCampground});
		}
	});
});

app.listen(3000, () => 
	console.log('The YelpCamp Server has started!'));