const mongoose = require('mongoose');
const { MessageEmbed } = require('discord.js');
var Guild = require('../schema(s)/guild');
const leave = require('../secondary/emojis.json');

module.exports = async (client, guild) => {

    client.logger.info(`${client.user} left ${guild.name}`);
    const serverLog = client.channels.cache.get(client.logID);
    if (serverLog)
      serverLog.send(new MessageEmbed().setDescription(`${leave} ${client.user} has left \`${guild.name}\``));
  
    Guild.findOneAndDelete({
        guildID: guild.id
    }, (err, res) => {
        if(err) console.error(err)
    });
};