'use strict';

const mongoose = require('mongoose'), 
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	User = require('./models/user');

const data = [
	{
		name: 'Cloud\'s Rest', 
		price: '9.00',
		image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',
		description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
	},
	{
		name: 'Desert Mesa', 
		price: '12.25',
		image: 'https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg',
		description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
	},
	{
		name: 'Canyon Floor',
		price: '24.50',
		image: 'https://farm1.staticflickr.com/189/493046463_841a18169e.jpg',
		description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
	}
]

function seedDB() {
	// Remove all campgrounds
	Campground.remove({}, function(err){
		if (err) {
			console.log(err);
		}
		console.log('removed campgrounds!');
		
		// Remove all comments
		Comment.remove({}, function(err) {
			if (err) {
				console.log(err);
			}
			console.log('removed comments!');
			
			// Remove all users
			User.remove({}, function(err) {
				if (err) {
					console.log(err);
				}
				console.log('removed users!');
				
				// Create the admin user
				User.register(new User({username: 'admin'}), 'root', function(err, user) {
					if (err) {
						console.log(err);
					} 
					console.log('Created user!');
					
					// Create the campgrounds
					data.forEach(seed => {
						
						// Add reference to our admin author for the campgrounds
						seed.author = {
							id: user._id,
							username: user.username
						};

						Campground.create(seed, function(err, campground){
							if (err) {
								console.log(err)
							} else {
								console.log('added a campground');
								
								// Create and add a comment
								Comment.create(
									{
										text: 'This place is great, but I wish there was internet',
										author: {
											id: user._id,
											username: user.username
										}
									}, function(err, comment){
										if(err){
											console.log(err);
										} else {
											campground.comments.push(comment);
											campground.save();
											console.log('Created new comment');
										}
									});
								}
							});
						});
					});
				});
			});
		}); 
	}
	
	module.exports = seedDB;