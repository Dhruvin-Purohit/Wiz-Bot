const Command = require('../Command.js');
const ReactionMenu = require('../ReactionMenu.js');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
var Guild = require('../../schema(s)/guild')

module.exports = class ServersCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'servers',
      aliases: ['servs'],
      usage: 'servers',
      description: 'Sick command, get a complete list of bot\'s servers.',
      type: client.types.OWNER,
      ownerOnly: true
    });
  }
  async run(message) {

    let guildinfo = await Guild.findOne({guildID: message.guild.id});

    const servers = message.client.guilds.cache.array().map(guild => {
      return `\`${guild.id}\` - **${guild.name}**\n
      **OwnerID - OwnerNick - OwnerName** - \`${guild.ownerID}-${guild.owner.displayName}-${guild.owner.user.username}\`
       \n\`${guild.members.cache.size}\` members\n\n**Invite** ${message.client.generateInvite(guild = guild)}\n
       **Prefix** ${guildinfo.prefix}\n\n`;
    });

    const embed = new MessageEmbed()
      .setTitle('Server List')
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (servers.length <= 2) {
      const range = (servers.length == 1) ? '[1]' : `[1 - ${servers.length}]`;
      message.channel.send(embed.setTitle(`Server List ${range}`).setDescription(servers.join('\n')));
    } else {
      new ReactionMenu(message.client, message.channel, message.member, embed, servers);
    }
  }
};
