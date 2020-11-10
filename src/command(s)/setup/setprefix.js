const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { Success } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');
const Guild = require('../../schema(s)/guild')

module.exports = class SetPrefixCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setprefix',
      aliases: ['settheprefix', 'prefix'],
      usage: 'setprefix <new prefix>',
      description: oneLine`
        Sets the prefix for your server.
        Provide no prefix to set the default
      `,
      type: client.types.SETUP,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setprefix juice']
    });
  }
  async run(message, args) {

    let guild = await Guild.findOne({guildID: message.guild.id})

    const currentprefix = guild.prefix;
    const embed = new MessageEmbed()
      .setTitle('Prefix:')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`${Success} Changed the Prefix`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (args.length === 0) {
      guild.prefix = "s!";
      guild.save()
      .then(result => console.log(result))
      .catch(err => console.error(err));

      return message.channel.send(embed.addField('Prefix Changed', `**${currentprefix}** ➔ **s!**`));
    }

    const newprefix = args[0];
    if (!newprefix) return this.sendErrorMessage(message, 0, 'Bruh give me an actual prefix');
    else if (newprefix.length > 5) 
      return this.sendErrorMessage(message, 0, 'Yo Keep the prefix under 6 characters, dude.');
    guild.prefix = newprefix;
    guild.save()
    .then(result => console.log(result))
    .catch(err => console.error(err));

    message.channel.send(embed.addField('Prefix Changed', `**${currentprefix}** ➔ **${newprefix}**`));
  }
};
