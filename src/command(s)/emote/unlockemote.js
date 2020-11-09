const WizCommand = require('../WizCommand.js')

module.exports = class EmoteCommand extends WizCommand {
     constructor(client) {
          super(client, {
               name: 'unlockemote',
               aliases: ["unlockemoji", "emojiunlock", "emoteunlock"],
               usage: "unlockemote <emote or emote_id>",
               minargs: 1,
               missingargs: "Specify what emote you want to unlock",
               description: `unlock an emote which was locked to a role earlier on
               (even if it wasn't this will run) due to the wonderful code i have put in`,
               clientPermissions: ["MANAGE_EMOJIS"],
               userPermissions: ["MANAGE_EMOJIS"],
               examples: ["unlockemote emoji"]
          })
     }
     async run(message, args) {
          const emote = message.guild.emojis.cache.get(args[0])
          if (!emote) {
               return message.channel.send('That is not a valid server emote(do not try to unlock default emotes or emotes from other servers)')
          }
          emote.roles.set([''])
               .then(message.channel.send(`:+1:Done, ${emote} is now unlocked`))
               .catch(message.channel.send(`:-1:Seems like there is an error with my code...`), console.error);
     }
}