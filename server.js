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
mongoose.connect('mongodb://localhost/newscraper', {
    useMongoClient: true
});

// Routes

//Get route to scrape website
app.get('/scrape', function (req, res) {
    //first grab body of html with request
    axios.get('http://dirtragmag.com/category/news/').then(function (response) {
        //next, load into cheerio and save for shorthand selector
        var $ = cheerio.load(response.data);
        //now grab every h2 within article tag
        $('article h3').each(function (i, element) {
            //save empty result object
            var result = {};
            //add text and href of all links save as property of result object
            result.title = $(this).children('a').text();
            result.link = $(this).children('a').attr('href');
            //create new article using the result
            db.Article.create(result).then(function (dbArticle) {
                    //if able to scrape send message to client
                })
                .catch(function (err) {
                    //if error occours send to client
                    res.json(err);
                });
        });
        res.send('Scrape Complete');

    });
});


// Route for getting all article from DB
app.get('/articles', function (req, res) {
    db.Article.find().then(function (articles) {
            res.json(articles);
        })
        .catch(function (err) {
            res.json(err);
        });
});


//route for grabbing specific article by ID
app.get('/articles/:id', function (req, res) {
    db.Article.findOne({
            _id: req.params.id
        }).populate('note').then(function (article) {
            res.json(article);
        })
        .catch(function (err) {
            res.json(err);
        });
});


//route for saving or updating an artiles note
app.post('/articles/:id', function (req, res) {
    db.Note.create(req.body).then(function (dbNote) {
        return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                $push: {
                    note: dbNote._id
                }
            }, {})
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });
})

//start the server
app.listen(PORT, function () {
    console.log('App running on port ' + PORT + '!');
});
