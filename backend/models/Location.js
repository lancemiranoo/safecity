const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['North', 'South', 'West', 'East', 'NortEast', 'NortWest',
            'SouthEast', 'SouthWest'],
        required: true,
    },
});

module.exports = mongoose.model('Location', locationSchema);
