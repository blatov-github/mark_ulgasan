const mongoose = require('mongoose');
// Package to make a field of table auto-increasement 

/**
 * Create User Model
 * Add AutoIncrease Plugin
 */
module.exports = mongoose.model('balance', new mongoose.Schema({
    userid: 'number',
    btc: 'number',
    lc: 'number',
    agent: 'number',
    create_time: {
        type: Date,
        default: Date.now()
    },
    update_time: {
        type: Date
    },
    is_deleted: {
        type: String,
        default: 'N'
    },
}));