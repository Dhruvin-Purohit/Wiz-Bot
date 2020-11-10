const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');
const User = require('../../schema(s)/user');
const fetch = require('node-fetch');
const config = require('../../../config.json');

module.exports = class BsStatsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'brawlers',
      usage: 'bsstats <player_tag>',
      description: oneLine`
        Sets the prefix for your server.
        Provide no prefix to set the default
      `,
      type: client.types.SETUP,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['bsstats']
    });
  }
  async run(message, args) {

    const token = config.bsapi;

    try {
        const res = await fetch(`https://api.brawlstars.com/v1/brawlers`, { headers: {'Authorization': `Bearer ${token}`}});
        const stats = await res.json();
        if (!stats.reason) {

        const embed = new MessageEmbed()

        message.channel.send(embed);
        } else {
            const shit = new MessageEmbed()
            .setDescription(`**Error**: \`${stas.reason}\`\n**Message**: \`${stats.message || 'None'}\``)
            message.channel.send(shit)
        }
      } catch (err) {
        message.client.logger.error(err.stack);
        this.sendErrorMessage(message, 1, 'Please try again in a few seconds', err.message);
      }

  }
}