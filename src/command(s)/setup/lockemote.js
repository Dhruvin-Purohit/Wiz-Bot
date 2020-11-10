const Command = require('../Command');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class LockEmoteCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'lockemote',
            aliases: ['lockemoji'],
            description: oneLine`
            Locks the given emote to a certain role.
            **Warning**: The emote will be bound to that role and people without the role will lose access to that emote.
            `,
            type: client.types.SETUP,
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
            userPermissions: ['SEND_MESSAGES'],
            examples: [`lockemote ${emojis.special} @owner`]
        })
    }
    async run (message, args) {

    }
}