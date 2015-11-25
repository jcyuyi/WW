var express = require('express');
var app = express();
var jwt = require('jwt-simple');
var bodyParser = require('body-parser')

var NotFoundError = require('./api_v1/errors/NotFoundError');

// set jwt Token Secret
app.set('jwtTokenSecret', 'WW_API_1_fhsaa54d32323');

// to parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.send("This is the '/' route in api_v1 app");
});

var user = require("./api_v1/user");
app.use('/user', user);

var series = require("./api_v1/series");
app.use('/series', series);

// handle API not found error
app.use(function(req, res, next) {
	console.log("API 404");
    var err = new NotFoundError("API Not Found");
    res.status(err.code).json({
        'error': err.message
    });
});

module.exports = app;
