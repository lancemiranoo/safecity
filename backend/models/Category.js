const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['safe', 'neutral', 'dangerous'],
        required: true,
    },
});

module.exports = mongoose.model('Category', categorySchema);
