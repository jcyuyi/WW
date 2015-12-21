var express = require('express');
var app = express();
var jwt = require('jwt-simple');

var Series = require('./models/series');
var UnauthorizedError = require('./errors/UnauthorizedError');
var BadRequestError = require('./errors/BadRequestError');

app.all('/', function(req, res, next) {
    var sessionToken = req.headers.sessiontoken;
    if (!sessionToken) {
        req.userid = undefined;
        console.log("session token not found");
    } else {
        var decoded_userid;
        try {
            decoded_userid = jwt.decode(sessionToken, app.get('jwtTokenSecret')).iss;
            console.log("session token validated! User: " + decoded_userid);
            req.userid = decoded_userid;
        } catch (err) {
            console.log(err);
            req.userid = undefined;
        }
    }
    next();
});

// create series
app.post('/', function(req, res) {
    var userid = req.userid;
    console.log("create series... user: " + userid);
    // get post data
    var name = req.body.name;
    var current = req.body.current;
    var total = req.body.total;
    var isPublic = req.body.isPublic;
    var note = req.body.note;
    var series = new Series({
        name: name,
        current: current,
        total:total,
        isPublic:isPublic,
        note:note,
        createdBy:userid
    });
    series.save(function(error) {
        if (error) {
            console.log(error);
            var err = new BadRequestError("Invalid parament");
            // if (error.code === 11000) err.message = "username has been used";
            res.status(err.code).json({
                'error': err.message
            });
            return;
        } else {
            res.status(201).json(series);
            console.log("series created:", series);
        }
    });
});

module.exports = app;
