const mongoose = require('mongoose');
const User = require('./User');
const Location = require('./Location');
const Category = require('./Category');
const Status = require('./Status');

const reportSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    status: { type: mongoose.Schema.Types.ObjectId, ref: 'Status', required: true }, // References Status model

    description: { type: String, required: true },
    reported: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Report', reportSchema);
