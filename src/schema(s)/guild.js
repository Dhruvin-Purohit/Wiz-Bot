const mongoose = require('mongoose');

const Guild = mongoose.Schema({

        guildID: String,
        isbanned: {
             type: Boolean,
             default: false,
             required: true
        },
        prefix: {
            type: String,
            default: 'wiz',
            required: true
        },
        messagelogid: {
             type: String
        },
        joinleavelogid: {
             type: String
        },
        noinvite: {
             type: Boolean,
             default: false,
             required: true
        },
        muteroleid: {
            type: String
        }
})

module.exports = mongoose.model('Guild', Guild, 'guilds');