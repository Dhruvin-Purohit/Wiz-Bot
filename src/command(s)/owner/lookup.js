const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
var User = require('../../schema(s)/user')

/*const rgx = /^(?:<@!?)?(\d+)>?$/;*/

module.exports = class LookUpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'lookup',
      usage: 'lookup <user ID>',
      description: 'Get info of a particular user',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['lookup 772047962342948875']
    });
  }
  async run(message, args) {
    const userid = args[0];
    /*if (!rgx.test(userid))
      return this.sendErrorMessage(message, 0, 'Please provide a valid server ID');*/
    const user = message.surge.client.cache.get(userid);
    if (!user) return this.sendErrorMessage(message, 0, 'Unable to find user, Make sure you are using the correct ID');
    
    let userinfo = await User.findOne({userID: userid});

    const userasdf = `**User Name** - \`${user.name}\`\n
        **User ID** - \`${user.id}\`\n
        **Clash of Clans Player Tag** - \`${userinfo.coctag || 'Not Claimed'}\`\n
        **Clash Royale Player Tag** - \`${userinfo.crtag || 'Not Claimed'}\`\n
        **Brawl Stars Player Tag** - \`${userinfo.bstag || 'Not Claimed'}\`\n
        **Botbanned?** - \`${userinfo.isbotbanned}\``;
    
         const embed = new MessageEmbed()
        .setTitle('User Found')
        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setThumbnail(user.displayAvatarURL({dynamic: true}))
        .setColor(message.guild.me.displayHexColor);

        message.channel.send(embed.setDescription(userasdf));

  } 
};
