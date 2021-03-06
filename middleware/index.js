'use strict';

const Campground = require('../models/campground'),
	Comment = require('../models/comment');

module.exports = {

	checkCampgroundOwnership: function(req, res, next) {
		if (req.isAuthenticated()) {
			Campground.findById(req.params.id, function(err, foundCampground) {
				if (err) {
					return next(err);
				} else if (!foundCampground) {
					return next(new Error('Could not find Campground'));
				} else {
					if (foundCampground.author.id.equals(req.user._id)) {
						return next();
					} else {
						req.flash('error', 'You don\'t have permission to do that');
						res.redirect('back');
					}
				}
			});
		} else {
			req.flash('error', 'You need to be logged in to do that');
			res.redirect('back');
		}
	},

	checkCommentOwnership: function(req, res, next) {
		if (req.isAuthenticated()) {
			Comment.findById(req.params.comment_id, function(err, foundComment) {
				if (err) {
					return next(err);
				} else if (!foundComment) {
					return next(new Error('Could not find Comment'));
				} else {
					if (foundComment.author.id.equals(req.user._id)) {
						return next();
					} else {
						req.flash('error', 'You don\'t have permission to do that');
						res.redirect('back');
					}
				}
			});
		} else {
			req.flash('error', 'You need to be logged in to do that');
			res.redirect('back');
		}
	},

	isLoggedIn: function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			req.flash('error', 'You need to be logged in to do that');
			res.redirect('/login');
		}
	},

};