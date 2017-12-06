var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

//Scraping tools
var axios = require('axios');
var cheerio = require('cheerio');

//Require all the models
var db = require('./models');

var PORT = 3000;

//Initialize the express app
var app = express();

//Set up the middleware

//using morgan logger to log requests
app.use(logger('dev'));

//use body parser to handle form submissions
app.use(bodyParser.urlencoded({
    extended: false
}));

//Use express.static to serve the public folder as a static directory
app.use(express.static('public'));


//set mongoose to use es6 JS promises
//connect to mongo DB
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/moonscraper', {
    use.MongoClient: true
});
