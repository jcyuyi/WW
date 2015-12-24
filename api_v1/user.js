var express = require('express');
var app = express();
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');

var User = require('./models/User');

var UnauthorizedError = require('./errors/UnauthorizedError');
var BadRequestError = require('./errors/BadRequestError');


console.log('mongoose connection');
// database connection
mongoose.connect('mongodb://localhost/ww_1', function(err) {
    if (err) {
        console.log('mongoose connection error', err);
    } else {
        console.log('mongoose connection successful');
    }
});

// Login user
app.get('/', function(req, res) {
    var username = req.query.username;
    var password = req.query.password;

    // check param
    if (!username || !password) {
        console.log('param check failed');
        var err = new BadRequestError("Invalid username or password");
        res.status(err.code).json({
            'error': err.message
        });
        return;
    }

    // login
    console.log('try login user:', username);
    User.findOne({
        username: username
    }, function(err, user) {
        if (err) throw err;

        // check if user exist
        if (!user) {
            var err = new UnauthorizedError("Invalid username or password");
            res.status(err.code).json({
                'error': err.message
            });
            return
        };

        // test a matching password
        user.comparePassword(password, function(err, isMatch) {
            if (err) throw err;
            console.log('Password:', isMatch);
            if (isMatch) {
                // if user login successful
                var expires = moment().add('days', 30).valueOf();
                // get jwt token 
                var token = jwt.encode({
                    iss: user.username,
                    exp: expires
                }, app.get('jwtTokenSecret'));
                res.json({
                    sessionToken: token,
                    username: user.username,
                });
            } else {
                var err = new UnauthorizedError("Invalid username or password");
                res.status(err.code).json({
                    'error': err.message
                });
            }
        });
    });
});

// create user
app.post('/', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    // check param
    if (!username || !password) {
        console.log('post param check failed');
        var err = new BadRequestError("Invalid username or password");
        res.status(err.code).json({
            'error': err.message
        });
        return;
    }
    // create
    console.log('try create user:', username);
    var user = new User({
        username: username,
        password: password
    });
    user.save(function(error) {
        if (error) {
            console.log(error);
            var err = new BadRequestError("Invalid username or password");
            if (error.code === 11000) err.message = "username has been used";
            res.status(err.code).json({
                'error': err.message
            });
            return;
        } else {
            // if user create successful
            var expires = moment().add(30,'days').valueOf();
            // get jwt token 
            var token = jwt.encode({
                iss: user.username,
                exp: expires
            }, app.get('jwtTokenSecret'));
            res.json({
                sessionToken: token,
                username: user.username,
            });
            console.log("user created:", user);
        }
    });
});

app.delete('/:username', function(req, res) {
    var token = req.headers.sessiontoken;
    if (!token) {
        var err = new UnauthorizedError("Token not found");
        res.status(err.code).json({
            'error': err.message
        });
        return;
    }
    var req_username = req.params.username;
    var decoded_username;
    try {
        decoded_username = jwt.decode(token, app.get('jwtTokenSecret')).iss;
    } catch (err) {
        console.log(err);
    }
    if (decoded_username && decoded_username == req_username) {
        // remove user from db
        User.remove({
            username: decoded_username
        }, function(err, user) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                res.sendStatus(204);
            }
        });
    } else {
        var err = new UnauthorizedError("Invalid Token");
        res.status(err.code).json({
            'error': err.message
        });
    }
});

module.exports = app;
