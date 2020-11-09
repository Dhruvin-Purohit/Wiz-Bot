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
        }
})

module.exports = mongoose.model('User', User, 'users');