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

// Routes

//Get route to scrape website
app.get('/scrape', function (req, res) {
    //first grab body of html with request
    axios.get('http://www.XXXXXXXX.com/').then(function (response) {
        //next, load into cheerio and save for shorthand selector
        var $ = cheerio.load(response.data);
        //now grab every h2 within article tag
        $('article h2').each(function (i, element) {
            //save empty result object
            var result = {};
            //add text and href of all links save as property of result object
            result.title = $(this).children('a').text();
            result.link = $(this).children('a').attr('href');
            //create new article using the result
            db.Article.create(result).then(function (dbArticle) {
                //if able to scrape send message to client
                res.send('Scrape Complete');
            })
        })
    })
})
