const { MessageEmbed } = require('discord.js');
const WizCommand = require('../WizCommand.js')

module.exports = class PingCommand extends WizCommand {
     constructor(client) {
     super(client, {
     triggers: ['ping'],
     usage: 'ping',
     description: 'Get WIz\'s Latency'
     });
     }
     async run(message) {
          const embed = new MessageEmbed()
          .setDescription(`**Pinging...**`)
          .setColor("RANDOM");
 
          const msg = await message.channel.send(embed);
          const timestamp = (message.editedTimestamp) ? message.editedTimestamp : message.createdTimestamp; // Check if edited
          const latency = `\`\`\`md\n= ${Math.floor(msg.createdTimestamp - timestamp)}ms =\`\`\``;
          const apiLatency = `\`\`\`md\n= ${Math.round(message.client.ws.ping)}ms =\`\`\``;
               new embed.setTitle(`Pong!`)
                    .setDescription('')
                    .addField('Latency', latency, true)
                    .addField('API Latency', apiLatency, true)
                    .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();
                         msg.edit(embed);
     }
}