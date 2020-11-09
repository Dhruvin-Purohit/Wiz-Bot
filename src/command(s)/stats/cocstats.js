const WizCommand = require('../WizCommand.js')
const { MessageEmbed } = require('discord.js')

module.exports = class StatsCommand extends WizCommand {
     constructor(client) {
          super(client, {
               name: "clashofclansstats",
               aliases: ['cocstats'],
               usage: "cocstats <player tag>",
               minargs: 1,
               missingargs: "What Player Tag do you want me to search for?",
               description: "Get Clash of Clans stats of a player by their player tag",
               userPermissions: ["SEND_MESSAGES"],
               examples: ["clashofclansstats #000000"],
          })
     }
     async run(message, args) {

     }
}