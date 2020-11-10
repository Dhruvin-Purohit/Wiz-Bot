const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');
const User = require('../../schema(s)/user');
const fetch = require('node-fetch');
const config = require('../../../config.json');

module.exports = class SetBsTagCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setbrawltag',
      aliases: ['setbtag', 'linkbrawl', "linkbrawlstars"],
      usage: 'bsstats <player_tag>',
      description: oneLine`
        Sets the prefix for your server.
        Provide no prefix to set the default
      `,
      type: client.types.SETUP,
      userPermissions: ['SEND_MESSAGES'],
      examples: ['setbrawltag #0000000']
    });
  }
  async run(message, args) {

    const token = config.bsapi;
    
    let user = await User.findOne({userID: message.author.id})

    if (args[0]) {

    let tag = args[0]

    const rgx = /^#?[0-9A-Z]/i;

    const failembed = new MessageEmbed()
    .setDescription(`${emojis.Angry} Give a Valid Player Tag`);

    if (!rgx.test(tag)) return message.channel.send(failembed)
    if (tag.startsWith('#')) tag = tag.slice(1);

    try {
        const res = await fetch(`https://bsproxy.royaleapi.dev/v1/players/%23${tag}`, { headers: {'Authorization': `Bearer ${token}`}});
        const stats = await res.json();
        if (!stats.reason) {

        const embed = new MessageEmbed()
        .setDescription(`${message.author.displayName},Your Brawl Stars Account, ${emojis.bs}
        **${stats.name}**[${stats.tag}] is now linked to your account${emojis.GG}`)

          const currently = user.bstag;
          const newtag = tag;
          if (!currently) {
            user.bstag = newtag;
            user.save()
            .then(result => console.log(result))
            .catch(err => console.error(err));

            return message.channel.send(embed)
          } else {
            user.bstag = newtag;
            user.save()
            .then(result => coneole.log(result))
            .catch(err => console.log(err))

            const bruh = new MessageEmbed()
            .setDescription(`${message.author.displayName},Your Brawl Stars Account has been updated successfully, ${emojis.bs}
            **\`${tag}\`** ➔ **\`${stats.tag}\`** Your new Account name is:**${stats.name}**${emojis.GG}`);

            return message.channel.send(bruh)
            
          }
        } else if (stats.reason === 'notFound') {
            const nofind = new MessageEmbed()
            .setDescription(`${emojis.Angry} That's not an actually Valid Player Tag.`)
            message.channel.send(nofind)
        } else {
            const shit = new MessageEmbed()
            .setDescription(`**Error:** \`${stats.reason}\`\n**Message:** \`${stats.message || 'None'}\``)
            message.channel.send(shit)
        }
      } catch (err) {
        message.client.logger.error(err.stack);
        this.sendErrorMessage(message, 1, 'Please try again in a few seconds', err.message);
      }

    } else {
        const notspecified = new MessageEmbed()
        .setDescription(`${emojis.Phew} Why would i link nothing to your account?`);

        return message.channel.send(notspecified)
    }
  }
};
