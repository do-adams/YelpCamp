'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});

const Campground = require('../models/campground'),
	Comment = require('../models/comment');

const middleware = require('../middleware');

// NEW AND CREATE ROUTES

router.get('/new', middleware.isLoggedIn, (req, res, next) => {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {
			return next(err);
		} else if (!foundCampground) {
			return next(new Error('Could not find campground'));
		} else { 
			res.render('comments/new', {campground: foundCampground});
		}
	});
});

router.post('/', middleware.isLoggedIn, (req, res, next) => {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {
			return next(err);
		} else if (!foundCampground) {
			return next(new Error('Could not find campground'));
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					return next(new Error('Something went wrong when creating a comment'));
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save(); // save changes to comment

					foundCampground.comments.push(comment);
					foundCampground.save();

					req.flash('success', 'Successfully added comment');
					res.redirect('/campgrounds/' + foundCampground._id);
				}
			});
		}
	});
});

// EDIT AND UPDATE ROUTES

router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res, next) => {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if (err) {
			return next(err);
		} else if (!foundComment) {
			return next(new Error('Could not find comment'));
		} else {
			res.render('comments/edit', 
			{
				campground_id: req.params.id,
				comment: foundComment
			});
		}
	});
});

router.put('/:comment_id', middleware.checkCommentOwnership, (req, res, next) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err) {
			return next(err);
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

// DESTROY ROUTE

router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res, next) => {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			return next(err);
		} else {
			req.flash('success', 'Comment deleted');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

module.exports = router;