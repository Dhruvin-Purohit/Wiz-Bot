const mongoose = require('mongoose');

const User = mongoose.Schema({

        userID: String,
        isbotbanned: {
            type: Boolean,
            default: false,
            required: true
        },
        coctag: {
            type: String
        },
        crtag: {
            type: String
        },
        bstag: {
            type: String
        },
        Stage: {
            type: Number,
            default: 1,
            required: true
        }
})

module.exports = mongoose.model('User', User, 'users');