# YelpCamp

![Yelp Camp Collage](/YelpCamp_Collage.jpg "YelpCamp Collage")

YelpCamp is a full-stack web application built with Node.js, Express, and MongoDb or what is known as the MEN stack. It is a simple Yelp clone for campers and a fun learning exercise from one of Colt Steele's web development courses on [Udemy](https://www.udemy.com/the-web-developer-bootcamp/learn/v4/overview).

The responsive web app allows visitors to:
* Sign Up
* Login
* Browse Campgrounds
* Create Campgrounds
* Edit Campgrounds
* Delete Campgrounds
* Comment on Campgrounds
* Edit Comments

I added a few improvements of my own such as [`dotenv`](https://www.npmjs.com/package/dotenv) for environment variables, [`connect-mongo`](https://github.com/jdesboeufs/connect-mongo) for MongoDb session storage, [`longjohn`](https://github.com/mattinsler/longjohn) for async stack trace debugging, and a couple of more goodies such as 404 and error-handling middleware. I also did my best to follow the AirBnB JavaScript style [guide](https://github.com/airbnb/javascript) for the codebase.

### Code Features

* Mongoose Models
* Express Routers
* RESTful Routing Practices
* EJS Template Views
* Connect Middleware
* Web Sessions
* Flash Messages
* Local Web Authentication
* Web Authorization

YelpCamp leverages the features of Express 4.0 to provide an MVC architecture that uses mongoose models, routers, EJS template views, and connect-style middleware to provide dynamic server-side markup to browsers.

### Setup

YelpCamp works out of the box. You, of course, need to have both Node.js and MongoDb installed on your computer.

1. Clone the repo
2. Open a `Terminal` in the project directory
3. Run `npm install`
4. In another `Terminal` tab or window, run `mongod`, the mongo daemon instance for your db
5. Run `npm start`
6. Open a browser window and visit `http://localhost:3000/`

##### Environment Variables

If you actually want to deploy this somewhere (why?), you can easily do so by configuring the following environment variables. 

YelpCamp uses the `dotenv` Node module so you can create a `.env` file with the following key-value pairs:

```
NODE_ENV=<node_environment>
DATABASE_URL=<connection_string_for_mongo_db>
SESSION_SECRET=<key_for_encrypting_session_cookies>
PORT=<port_number>
```

### Technologies Used

* Bootstrap
* EJS
* Node.js
* Express
* MongoDb
* mongoose
* connect-session
* connect-flash
* passport
* method-override
