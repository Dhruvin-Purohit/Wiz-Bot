const mongoose = require('mongoose');

const Member = mongoose.Schema({

        memberID: String,
        coctag: {
            type: String
        },
        crtag: {
            type: String
        },
        bstag: {
            type: String
        },
        ismuted: {
             type: Boolean,
             required: true,
             default: false
        },
        warnings: {
             type: Number,
             required: true,
             default: 0
        }
})

module.exports = mongoose.model('Member', Member, 'member');