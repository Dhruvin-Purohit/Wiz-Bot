const mongoose = require('mongoose');
const { MessageEmbed } = require('discord.js');
var Guild = require('../schema(s)/guild');
const emojis = require('../utils/emojis.json');
const config = require('../../config.json');
const pics = require('../../data/pics.json');
const { oneLine } = require('common-tags')

module.exports = async (client, guild) => {

    client.logger.info(`${client.user} joined ${guild.name}`);
  const serverLog = client.channels.cache.get(client.logID);
  if (serverLog)
    serverLog.send(new MessageEmbed().setDescription(`${emojis.Special} ${client.user} has joined \`${guild.name}\``));

try {
  const embed = new MessageEmbed()
        .setThumbnail(pics.Yo)
        .setDescription(`${emojis.Happy}Yo I am Surge\n\nMy default prefix is \`${config.prefix}\`\nUse \`${config.prefix}setprefix <new_prefix>\` to change it`)
        .addField(`${emojis.Thanks}Thanks`, oneLine`
        Thanks for [Inviting](${config.invite}) me
        `)
        .addField(`${emojis.Special}Support`, oneLine`
        You can join the [Support Server](${config.support}) for further help!
        `)
        .addField(`${emojis.Thonk}My Code`, oneLine`
        You can see all my code on my [GitHub](${config.github}) Repository.\n
        `);

        const channel = guild.channels.cache.get((guild.channels.cache.filter(c => c.type === 'text').map(c => c.id))[0]);
try {
        channel.send(embed)
} catch (err) {
  console.log(err)
}

} catch (err) {
  console.log(err)
}

    let muteRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
  if (!muteRole) {
    try {
      muteRole = await guild.roles.create({
        data: {
          name: 'Muted',
          permissions: []
        }
      });
    } catch (err) {
      client.logger.error(err.message);
    }
    for (const channel of guild.channels.cache.values()) {
      try {
        if (channel.viewable && channel.permissionsFor(guild.me).has('MANAGE_ROLES')) {
          if (channel.type === 'text')
            await channel.updateOverwrite(muteRole, {
              'SEND_MESSAGES': false,
              'ADD_REACTIONS': false
            });
          else if (channel.type === 'voice' && channel.editable)
            await channel.updateOverwrite(muteRole, {
              'SPEAK': false,
              'STREAM': false
            });
        } 
      } catch (err) {
        client.logger.error(err.stack);
      }
    }
  }

    guild = new Guild({
        guildID: guild.id,
        prefix: config.prefix,
        muteroleid: muteRole.id,
    });

    guild.save()
    .then(result => console.log(result))
    .catch(err => console.error(err));

};