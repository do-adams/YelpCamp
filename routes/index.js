'use strict';

const express = require('express'),
	passport = require('passport');

const router = express.Router();

const User = require('../models/user');

router.get('/', (req, res) => {
	res.render('landing');
});

// ===================
// AUTH ROUTES
// ===================

router.get('/register', (req, res) => {
	res.render('register');
});

router.post('/register', (req, res, next) => {
	User.register(new User({username: req.body.username}), 
		req.body.password, function(err, user) {
			if (err) {
				return next(err);
			} else {
				passport.authenticate('local')(req, res, function() {
					req.flash('success', 'Welcome to YelpCamp, ' + user.username);
					res.redirect('/campgrounds');
				});
			}
		});
});

router.get('/login', (req, res) => {
	res.render('login');
});

router.post('/login', passport.authenticate('local', 
	{
		successRedirect: '/campgrounds',
		failureRedirect: '/login',
		failureFlash: true
	})
);

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'Logged you out!');
	res.redirect('/campgrounds');
});

module.exports = router;