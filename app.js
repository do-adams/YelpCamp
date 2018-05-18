'use strict';

const path = require('path'),
	express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	session = require('express-session'),
	flash = require('connect-flash'),
	passport = require('passport'),
	methodOverride = require('method-override'),
	User = require('./models/user'),
	seedDB = require('./seeds');

// Enable async stack trace logging (not for production use)
require('longjohn');

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

app.use(session({
	secret: 'This string should definitely not be here',
	resave: false,
	saveUninitialized: false
}));

app.use(flash());

// PASSPORT CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Sends user session info to views
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	return next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// 404 Middleware
app.use((req, res) => {
	res.status(404).send('404: Page not found!');
});

// Error-handling middleware
app.use((err, req, res, next) => {
	console.error(err);
	console.error(err.stack);
	req.flash('error', err.message);
	res.status('500');
	res.redirect('back');
});

app.listen(3000, () => 
	console.log('The YelpCamp Server has started!'));