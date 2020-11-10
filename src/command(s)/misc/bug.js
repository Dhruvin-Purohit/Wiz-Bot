const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');
const config = require('../../../config.json')

module.exports = class BugCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'bug',
      aliases: ['bugreport', 'report'],
      usage: 'bug <message>',
      description: oneLine`
        Found a Bug?
        Report it and it will be sent to our support Server
        Try to include as much information as possible.
      `,
      type: client.types.MISC,
      examples: ['reportbug bot is botched']
    });
  }
  run(message, args) {
    const reportChannel = message.client.channels.cache.get(message.client.bugID);
    if (!reportChannel)
      return this.sendErrorMessage(message, 1, 'The bug channel not set');
    if (!args[0]) return this.sendErrorMessage(message, 0, 'Please provide a message to send');
    let report = message.content.slice(message.content.indexOf(args[0]), message.content.length);

    // Send report
    const reportEmbed = new MessageEmbed()
      .setTitle('Bug Reported')
      .setThumbnail(reportChannel.guild.iconURL({ dynamic: true }))
      .setDescription(report) 
      .addField('User', message.member, true)
      .addField('Server', message.guild.name, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    reportChannel.send(reportEmbed);

    // Send response
    if (report.length > 1024) report = report.slice(0, 1021) + '...';
    const embed = new MessageEmbed()
      .setTitle('Bug Report')
      .setThumbnail('https://raw.githubusercontent.com/Magma-Bot/Magma-Bot/master/data/images/Magma-Bot.png')
      .setDescription(oneLine`
        Bug reported successfully!
        Please join the [Support Server](${config.support}) to further discuss your issue.
        You can also report and issue at [GitHub](${config.github}).
      `) 
      .addField('Member', message.member, true)
      .addField('Message', report)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};