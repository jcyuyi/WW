var express = require('express');
var app = express();
var jwt = require('jwt-simple');

var Series = require('./models/series');

app.post('/', function(req, res) {
    var sessionToken = req.query.sessionToken;
    if (!sessionToken) {
        var err = new UnauthorizedError("Invalid password");
        res.status(err.code).json({
            'error': err.message
        });
        return;
    }
    console.log(sessionToken);
});

module.exports = app;
