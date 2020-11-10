const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { exec } = require('child_process')
const emojis = require('../../utils/emojis.json')

module.exports = class ServersCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'bash',
      aliases: ['sh', 'exec'],
      usage: 'bash <query_here>',
      description: 'Do a console query',
      type: client.types.OWNER,
      ownerOnly: true
    });
  }
  async run(message, args) {
     message.channel.send(`**Input**\n\`\`\`sh\n${args.join(' ')}\`\`\``)
     exec(args.join(' '), async (e, stdout, stderr) => {
       if (stdout.length + stderr.length > 994) {
         message.channel.send(`Console log exceeds 2000 characters.`)
       } else {
         if (stdout) {
           message.channel.send(`**Output**\n\`\`\`bash\n${stdout}\`\`\``)
         }
         if (stderr) {
           message.channel.send(`**Errors**\n\`\`\`bash\n${stderr}\`\`\``)
         }
         if (!stderr && !stdout) {
           message.react(emojis.Success)
         }
       }
       })
     }
     
}
