const Command = require('../Command.js');
const mongoose = require('mongoose');
var User = require('../../schema(s)/user');
const emojis = require('../../utils/emojis.json');
const config = require('../../../config.json');
const { MessageEmbed } = require('discord.js');

/*const rgx = /^(?:<@!?)?(\d+)>?$/;*/

module.exports = class BotBanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'botban',
      usage: 'botban <user ID>',
      description: 'botban a particular user',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['botban 772047962342948875']
    });
  }
  async run(message, args) {
    const userid = args[0];
    /*if (!rgx.test(userid))
      return this.sendErrorMessage(message, 0, 'Please provide a valid server ID');*/
      if (userid === config.ownerid) {
          const embed = new MessageEmbed()
          .setDescription(`${emojis.Phew} You can't Bot-Ban yourself`)
          return message.channel.send(embed)
      }
    const user = message.client.users.cache.get(userid);
    if (!user) return this.sendErrorMessage(message, 0, 'Unable to find user, Make sure you are using the correct ID');
    
    const boomer = await User.findOne({
        userID: userid
      }, (err, boomer) => {
        if (err) console.error(err)
        
        if (!boomer) {
            const newUser = new User({
                userID: userid,
                isbotbanned: true
              })
    
            newUser.save()
            .then(result => console.log(result))
            .catch(err => console.error(err));
            if (err) {
                return message.react(emojis.Fail)
            } else {
            return message.react(emojis.Success)
            }
        } else {
            boomer.isbotbanned = true;
            boomer.save()
            .then(result => console.log(result))
            .catch(err => console.error(err));
            if (err) {
                return message.react(emojis.Fail)
            } else {
            return message.react(emojis.Success);
            }
        }
    });
  } 
};
