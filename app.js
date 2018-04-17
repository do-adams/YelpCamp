const express = require('express');
const app = express();

app.set('view engine', 'ejs');

const campgrounds = [
	{
		name: 'Salmon Creek', 
		image: 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c85daa025ee04c951b6ac12fe3ba031a&dpr=1&auto=format&fit=crop&w=1000&q=80&cs=tinysrgb'},
	{
		name: 'Granite Hill', 
		image: 'https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ec456c4aeb71d3aecbe65e586d186ec0&dpr=1&auto=format&fit=crop&w=1000&q=80&cs=tinysrgb'},
	{
		name: 'Mountain Goat\'s Rest', 
		image: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?ixlib=rb-0.3.5&s=818083f99e9b291ad60959b2594d97f3&dpr=1&auto=format&fit=crop&w=1000&q=80&cs=tinysrgb'}
];

app.use(express.urlencoded());

app.get('/', (req, res) => {
	res.render('landing');
});

app.get('/campgrounds', (req, res) => {
	res.render('campgrounds', {campgrounds: campgrounds});
});

app.post('/campgrounds', (req, res) => {
	const name = req.body.name;
	const image = req.body.image;
	campgrounds.push({name: name, image: image});
	res.redirect('/campgrounds');
});

app.get('/campgrounds/new', (req, res) => {
	res.render('new');
});

app.listen(3000, () => 
	console.log('The YelpCamp Server has started!'));