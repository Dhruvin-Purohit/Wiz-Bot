const mongoose = require('mongoose');

const Guild = mongoose.Schema({

        guildID: String,
        prefix: {
            type: String,
            default: 's!',
            required: true
        },
        muteroleid: {
            type: String
        }
})

module.exports = mongoose.model('Guild', Guild, 'guilds');