'use strict';

const express = require('express'),
	app = express(),
	mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/yelp_camp');

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const campgroundSchema = new mongoose.Schema({
	name: String,
	image: String
});
const Campground = mongoose.model('Campground', campgroundSchema);

app.get('/', (req, res) => {
	res.render('landing');
});

app.get('/campgrounds', (req, res) => {
	Campground.find({}, function(err, campgrounds) {
		if (err) console.log(err);
		else res.render('campgrounds', {campgrounds: campgrounds});
	});
});

app.post('/campgrounds', (req, res) => {
	const name = req.body.name;
	const image = req.body.image;
	const newCampground = {name: name, image: image};

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

app.listen(3000, () => 
	console.log('The YelpCamp Server has started!'));