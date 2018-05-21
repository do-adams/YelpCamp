'use strict';

// ENVIRONMENT VARIABLES SETUP
require('dotenv').config();

// ASYNC STACK TRACES DEBUG SETUP
if (process.env.NODE_ENV !== 'production') require('longjohn');

// GENERAL DEPENDENCIES
const path = require('path'),
	express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	flash = require('connect-flash'),
	passport = require('passport'),
	methodOverride = require('method-override'),
	User = require('./models/user'),
	seedDB = require('./seeds');

// DB SETUP
const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost/yelp_camp';
mongoose.connect(mongoUrl);
if (process.env.NODE_ENV !== 'production') seedDB();

app.set('view engine', 'ejs');

// GENERAL EXPRESS MIDDLEWARE SETUP
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// EXPRESS SESSION AND MONGOSTORE SETUP
app.use(session({
	store: new MongoStore({
		url: mongoUrl
	}),
	secret: process.env.SESSION_SECRET || 'SUPER SECRET DEVELOPMENT KEY',
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7 * 2
	}
}));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// SET LOCAL VARS FOR TEMPLATE VIEWS
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	return next();
});

// SETUP ROUTERS
const indexRoutes = require('./routes/index'),
	campgroundRoutes = require('./routes/campgrounds'),
	commentRoutes = require('./routes/comments');

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// 404 MIDDLEWARE
app.use((req, res) => {
	res.status(404).send('404: Page not found!');
});

// ERROR HANDLER MIDDLEWARE
app.use((err, req, res, next) => {
	console.error(err.stack);
	req.flash('error', err.message);
	res.status(500);
	res.redirect('back');
});

app.listen(process.env.PORT || 3000, () => 
	console.log('The YelpCamp Server has started!'));