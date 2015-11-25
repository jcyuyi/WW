var mongoose = require('mongoose');

var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection('mongodb://localhost/ww_1');
autoIncrement.initialize(connection);

var SeriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    current: {
        type: Number,
        required: true
    },
    total: {
        type: Number
    },
    isPublic: {
        type: Boolean,
        required: true
    },
    note: {
        type: String
    },
    // who create this entry
    createdBy: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

SeriesSchema.plugin(autoIncrement.plugin, {
    model: 'Series',
    field: 'seriesId',
    startAt: 100,
    incrementBy: 1
});

SeriesSchema.pre('save', function(next) {
    var series = this;
    if (!series.updatedAt)
    	series.updatedAt = Date.now;
    next();
});

module.exports = mongoose.model('Series', SeriesSchema);
