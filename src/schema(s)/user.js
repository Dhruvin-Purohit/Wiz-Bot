const mongoose = require('mongoose');

const User = mongoose.Schema({

        userID: String,
        isbotbanned: {
            type: Boolean,
            default: false,
            required: true
        }
})

module.exports = mongoose.model('User', User, 'users');