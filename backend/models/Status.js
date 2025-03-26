const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['Under Investigation', 'Resolved', 'Dismissed'],
        required: true,
    },
});

module.exports = mongoose.model('Status', statusSchema);
