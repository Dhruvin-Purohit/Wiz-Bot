var Guild = require('../schema(s)/guild')
var User = require('../schema(s)/user.js')
var Member = require('../schema(s)/member.js')

module.exports = async (client, message) => {
  if (message.channel.type === 'dm' || !message.channel.viewable || message.author.bot) return;

  const uuser = await User.findOne({
     userID: message.author.id
   }, (err, uuser) => {
     if (err) console.error(err)
     
     if (!uuser) {
         const newUser = new User({
             userID: message.author.id,
             isbotbanned: false
           })
 
         newUser.save()
         .then(result => console.log(result))
         .catch(err => console.error(err));
 
         return message.channel.send(`You have been added to Database!\nYou should be able to run commands now.`).then(m => m.delete({timeout: 10000}));
     }
 });

 const gguild = await Guild.findOne({
     guildID: message.guild.id
 }, (err, gguild) => {
     if (err) console.error(err)
     
     if (!gguild) {
         const newGuild = new Guild({
             guildID: message.guild.id,
             prefix: 'wiz'
           })
 
         newGuild.save()
         .then(result => console.log(result))
         .catch(err => console.error(err));
 
         return message.channel.send(`Server added to Database!\nYou should be able to run commands now.`).then(m => m.delete({timeout: 10000}));
     }
 });

 const memberid = message.guild.id+=message.author.id

 const mmember = await Member.findOne({
      memberID: memberid
}, (err, mmember) => {
     if (err) console.log(err)

     if (!mmember) {
          const newMember = new Member({
               memberID: memberid
          })

          newMember.save()
          .then(result => console.log(result))
          .catch(err => console.log(err))

          return message.channel.send(`You have been added to database(as a member) now!\nYou should be able to run commands now.`)
     }
});

  // Command handler
  const prefix = gguild.prefix || 'wiz';
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*`);

  if (gguild.isbanned) return;
  if (uuser.isbotbanned) return;
  
  if (prefixRegex.test(message.content)) {

    const [, match] = message.content.match(prefixRegex);
    const args = message.content.slice(match.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    let command = client.commands.get(cmd) || client.aliases.get(cmd); // If command not found, check aliases
    if (command) {

      // Check permissions
      const permission = command.checkPermissions(message);
      if (permission) {
        return command.run(message, args); // Run command
      }
    } else if ( 
      (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) &&
      message.channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {
         message.channel.send(`Hey there 👋, I am Wiz.\nMy prefix here is ${guild.prefix}.`)
    }
  }

};
