const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { exec } = require('child_process')

module.exports = class ServersCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'reboot',
      aliases: ['restart'],
      usage: 'reboot <all>',
      description: 'Reboot the bot lol',
      type: client.types.OWNER,
      ownerOnly: true
    });
  }
  async run(message, args) {
         //if (args[0] === 'all') {
         const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setTimestamp()
                .setTitle("Bot Restarting...")

               await message.channel.send({embed});
               return process.exit();
         /*} else/* if (!args[0]) {
                const ok = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle("All Good...")
                await message.channel.send(ok)
               await exec('node index', () => { message.channel.send('Yo?') })
              } else {
              return message.channel.send(`${args[0]} is not a valid option.\ntbh, it never was an option either.`)
         }*/
  }
}