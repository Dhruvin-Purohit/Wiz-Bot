const WizCommand = require('./WizCommand.js')

module.exports = class LockEmoteCommand extends WizCommand {
     constructor(client) {
          super(client, {
               triggers: ["lockemote", "lockemoji", "emojilock", "emotelock"],
               usage: "lockemote <emote or emote_id> <role or role_id>",
               minargs: 2,
               missingargs: "Specify what emote you want and what role it needs to be locked with.",
               description: "lock an emote to a particular role",
               clientPermissions: ["MANAGE_EMOJIS"],
               userPermissions: ["MANAGE_EMOJIS"],
               examples: ["lockemote emoji @emoji"]
          })
     }
     async run(message, args) {
          const emote = message.guild.emojis.cache.get(args[0])
          if (!emote) {
               return message.channel.send('That is not a valid server emote(do not try to lock default emotes or emotes from other servers)')
          }
          const Role = this.getRoleFromMention(message, args[1]) || message.guild.roles.cache.get(args[1]);
          if (!Role) {
               return message.channel.send('As far as i know, that isn\'t a Valid Role or Role ID.')
          }
          const role = `'${Role.id}'`
          emote.roles.set([role])
               .then(message.channel.send(`:+1:Done, ${emote} is now locked to ${Role.id}`))
               .catch(message.channel.send(`:-1:Seems like there is an error with my code...`), console.error);
     }
}