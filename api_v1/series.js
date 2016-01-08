var express = require('express');
var app = express();
var jwt = require('jwt-simple');

var Series = require('./models/series');
var UnauthorizedError = require('./errors/UnauthorizedError');
var BadRequestError = require('./errors/BadRequestError');

app.all('*', function(req, res, next) {
    var sessionToken = req.headers.sessiontoken;
    if (!sessionToken) {
        req.username = undefined;
        console.log("session token not found");
    } else {
        var decoded_userid;
        try {
            decoded_userid = jwt.decode(sessionToken, app.get('jwtTokenSecret')).iss;
            console.log("session token validated! User: " + decoded_userid);
            req.username = decoded_userid;
        } catch (err) {
            console.log(err);
            req.username = undefined;
        }
    }
    next();
});

// create series
app.post('/', function(req, res) {
    var username = req.username;
    if (!username) {
    	var err = new UnauthorizedError("Invalid Token");
        res.status(err.code).json({
            'error': err.message
        });
        return;
    }
    console.log("create series... user: " + username);
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
        createdBy:username
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
    var username = req.username;
    if (!username) {
        // return limited public series default num
        var limit = req.query.limit
        if (!limit) {
        	limit = 7
        } else {
        	limit = parseInt(limit)
        }
        var offset = req.query.offset
         if (!offset) {
        	offset = 0
        } else {
        	offset = parseInt(offset)
        }
        var createdBy = req.query.createdBy
        if (createdBy) {
            Series.find({
                isPublic: true,
                createdBy:createdBy
            }).sort({
                updatedAt: -1
            }).exec(
                function(err, seriesList) {
                    if (err) {
                        res.status(500);
                        return;
                    }
                    res.status(200).json(seriesList);
                });
        } else {
            Series.find({
                isPublic: true
            }).sort({
                updatedAt: -1
            }).skip(offset).limit(limit).exec(
                function(err, seriesList) {
                    if (err) {
                        res.status(500);
                        return;
                    }
                    res.status(200).json(seriesList);
                });
        }
    } else {
    	// return only for current user
    	Series.find({
            createdBy:username
        }).sort({
            updatedAt: -1
        }).exec(
            function(err, seriesList) {
                if (err) {
                	res.status(500);
                    return;
                }
                res.status(200).json(seriesList);
            });
    }
});

// update series
app.put('/:seriesid', function(req, res) {
	var username = req.username;
    if (!username) {
    	var err = new UnauthorizedError("Invalid Token");
        res.status(err.code).json({
            'error': err.message
        });
        return;
    }
    var seriesid = req.params.seriesid;
    console.log("update/put series... user: " + username + " ,seriesid: " + seriesid);
    // find series and update
    Series.findOne({
        seriesId: seriesid,
        createdBy: username
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
                var updatedAt = req.body.updatedAt;
                if (updatedAt) {
                    var oldDate = new Date(series.updatedAt);
                    var newDate = new Date(updatedAt);
                    // no need to update an old series
                    if (newDate < oldDate) {
                         console.log("No need to update");
                         res.status(200).json(series);
                         return;
                    }
                }
                series.updatedAt = updatedAt; // if not set then use Now

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
    var username = req.username;
    if (!username) {
        var err = new UnauthorizedError("Invalid Token");
        res.status(err.code).json({
            'error': err.message
        });
        return;
    }
    var seriesid = req.params.seriesid;
    console.log("delete series... user: " + username + " ,seriesid: " + seriesid);
    // remove series from db
    Series.remove({
        	createdBy: username,
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
