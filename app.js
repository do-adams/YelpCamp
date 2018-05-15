'use strict';

const express = require('express'),
	app = express(),
	path = require('path'),
	mongoose = require('mongoose'),
	session = require('express-session'),
	passport = require('passport'),
	methodOverride = require('method-override'),
	User = require('./models/user'),
	seedDB = require('./seeds');

// Requiring Routes
const indexRoutes = require('./routes/index'),
	campgroundRoutes = require('./routes/campgrounds'),
	commentRoutes = require('./routes/comments');
	

mongoose.connect('mongodb://localhost/yelp_camp');
seedDB();

app.set('view engine', 'ejs');

const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// PASSPORT CONFIGURATION

app.use(session({
	secret: 'This should definitely not be here',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Sends user session info to views
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	return next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(3000, () => 
	console.log('The YelpCamp Server has started!'));