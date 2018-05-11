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

router.post('/register', (req, res) => {
	User.register(new User({username: req.body.username}), 
		req.body.password, function(err, user) {
			if (err) {
				console.log(err);
				return res.render('register');
			} else {
				passport.authenticate('local')(req, res, function() {
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
		failureRedirect: '/login'
	})
);

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/login');
	}
}

module.exports = router;