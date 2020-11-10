const { oneLine } = require('common-tags');
const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');
var Guild = require('../schema(s)/guild');
const emojis = require('../utils/emojis.json');
var User = require('../schema(s)/user');
const pics = require('../../data/pics.json');

module.exports = async (client, message) => {
  if (message.channel.type === 'dm' || !message.channel.viewable || message.author.bot) return;

  const boomer = await User.findOne({
    userID: message.author.id
  }, (err, boomer) => {
    if (err) console.error(err)
    
    if (!boomer) {
        const newUser = new User({
            userID: message.author.id,
            isbotbanned: false
          })

        newUser.save()
        .then(result => console.log(result))
        .catch(err => console.error(err));

        return message.channel.send(`You have been added to Database!${emojis.GG}\nYou should be able to run commands now.`).then(m => m.delete({timeout: 10000}));
    }
});
  const settings = await Guild.findOne({
    guildID: message.guild.id
}, (err, settings) => {
    if (err) console.error(err)
    
    if (!settings) {
        const newGuild = new Guild({
            guildID: message.guild.id,
            prefix: 's!'
          })

        newGuild.save()
        .then(result => console.log(result))
        .catch(err => console.error(err));

        return message.channel.send(`Server added to Database!${emojis.GG}\nYou should be able to run commands now.`).then(m => m.delete({timeout: 10000}));
    }
});



  // Command handler
  const prefix = settings.prefix || config.prefix;
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*`);
if (boomer.isbotbanned) return;
  if (prefixRegex.test(message.content)) {

    const [, match] = message.content.match(prefixRegex);
    const args = message.content.slice(match.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    let command = client.commands.get(cmd) || client.aliases.get(cmd);
    if (command) {
      // Check permissions
      const permission = command.checkPermissions(message);
      if (permission) {
        message.command = true;
        return command.run(message, args);
      }
    }
    else if ( 
      (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) &&
      message.channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {
      const embed = new MessageEmbed()
        .setTitle(`Yo I am Surge ${emojis.Happy}`)
        .setThumbnail(pics.Yo)
        .setDescription(`My prefix here is \`${prefix}\`\nYou can use \`${prefix}help\` command for further Guidance`)
        .addField(`${emojis.Phew}Invite Me`, oneLine`
        You can invite me [here](${config.invite})
        `)
        .addField(`${emojis.Special}Support Server`, oneLine`
        Need more help? Join the [Support Server!](${config.support})
        `)
        .addField(`${emojis.Thonk}My Code`, oneLine`
        My [GitHub](${config.github}) Repository has all my code.\n
        `)
        .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed);
    }
  }
  }