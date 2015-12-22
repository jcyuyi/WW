var express = require('express');
var app = express();
var jwt = require('jwt-simple');

var Series = require('./models/series');
var UnauthorizedError = require('./errors/UnauthorizedError');
var BadRequestError = require('./errors/BadRequestError');

app.all('*', function(req, res, next) {
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
    if (!userid) {
    	var err = new UnauthorizedError("Invalid Token");
        res.status(err.code).json({
            'error': err.message
        });
        return;
    }
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
            var err = new BadRequestError("Invalid parameters");
            // if (error.code === 11000) err.message = "username has been used";
            res.status(err.code).json({
                'error': err.message
            });
        } else {
            res.status(201).json(series);
            console.log("series created:", series);
        }
    });
});

// get series list
app.get('/', function(req, res) {
    var userid = req.userid;
    if (!userid) {
        // return all public series
        Series.find({
            isPublic: true
        }).sort({
            updatedAt: -1
        }).exec(
            function(err, seriesList) {
                if (err) {
                	res.status(500);
                }
                res.status(200).json(seriesList);
            });
    } else {
    	// return only for current user
    	Series.find({
            createdBy:userid
        }).sort({
            updatedAt: -1
        }).exec(
            function(err, seriesList) {
                if (err) {
                	res.status(500);
                }
                res.status(200).json(seriesList);
            });
    }
});

// update series
app.put('/:seriesid', function(req, res) {
	var userid = req.userid;
    if (!userid) {
    	var err = new UnauthorizedError("Invalid Token");
        res.status(err.code).json({
            'error': err.message
        });
        return;
    }
    var seriesid = req.params.seriesid;
    console.log("update/put series... user: " + userid + " ,seriesid: " + seriesid);
    // find series and update
    Series.findOne({
        seriesId: seriesid,
        createdBy: userid
        },
        function(err, series) {
            console.log("Find series to update: " + series);
            if (!series) {
                var err = new BadRequestError("Invalid token or seriesId");
                res.status(err.code).json({
                    'error': err.message
                });
            } else { // update
                // get and set fields
                var name = req.body.name;
                if (name) series.name = name;
                var current = req.body.current;
                if (current) series.current = current;
                var total = req.body.total;
                if (total) series.total = total;
                var isPublic = req.body.isPublic;
                if (isPublic) series.isPublic = isPublic;
                var note = req.body.note;
                if (note) series.note = note;
                var updatedAt = req.body.updatedAt;
                series.updatedAt = updatedAt; // if not set then use Now
                // save update
                series.save(function(error) {
                    if (error) {
                        console.log(error);
                        var err = new BadRequestError("Invalid parameters");
                        res.status(err.code).json({
                            'error': err.message
                        });
                    } else {
                    	res.status(200).json(series);
                    }
                });
            }
        });

});

// delete series
app.delete('/:seriesid', function(req, res) {
    var userid = req.userid;
    if (!userid) {
        var err = new UnauthorizedError("Invalid Token");
        res.status(err.code).json({
            'error': err.message
        });
        return;
    }
    var seriesid = req.params.seriesid;
    console.log("delete series... user: " + userid + " ,seriesid: " + seriesid);
    // remove series from db
    Series.remove({
        	createdBy: userid,
            seriesId: seriesid
        },
        function(error, result) {
            if (error) {
                console.log(error);
                var err = new BadRequestError("Invalid parameters");
                res.status(err.code).json({
                    'error': err.message
                });
            } else {
            	console.log("delete result:" + result);
                res.sendStatus(204);
            }
        });
});

module.exports = app;
