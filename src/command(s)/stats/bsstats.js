const WizCommand = require('../WizCommand.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const emojis = require('../../secondary/emojis.json')

module.exports = class StatsCommand extends WizCommand {
  constructor(client) {
    super(client, {
     name: "brawlstarsstats",
     aliases: ["brawlstats", "bsstats"],
     usage: 'brawlstarsstats <player_tag>',
     minargs: 1,
     missingargs: "What Player Tag do you want me to search for?",
     description: "Get Brawl Stars stats of a player by their player tag",
     userPermissions: ['SEND_MESSAGES'],
     examples: ['brawlsstarstats #00000']
    });
  }
  async run(message, args) {

    let tag = args[0]

    const rgx = /^#?[0-9A-Z]/i;

    const failembed = new MessageEmbed()
    .setDescription(`Give a Valid Player Tag`);

    if (!rgx.test(tag)) return message.channel.send(failembed)
    if (tag.startsWith('#')) tag = tag.slice(1);

    try {
        const res = await fetch(`https://bsproxy.royaleapi.dev/v1/players/%23${tag}`, { headers: {'Authorization': `Bearer ${client.API.bs}`}});
        const stats = await res.json();
        if (!stats.reason) {

        let color = stats.nameColor.slice(4)
        color = '#' + color

        let totalwins = stats.soloVictories + stats.duoVictories + stats["3vs3Victories"];

        /*//Calculating needed Exp.
        let a = 40;
        let d = 10;
        let T = a + stats.expLevel * d;
        let wtf = stats.expLevel / 2      
        let s = wtf * (2 * a + (stats.expLevel - 1) * d)
        let curr = s - T
            console.log(stats.expPoints)*/

            let images;
            const entries = Object.entries(league);
            entries.forEach(entry => {
              // entry[0] is the key, entry[1] is the value.
              if(stats.trophies > entry[0]) images = entry[1];
            });

        const embed = new MessageEmbed()
          .setTitle(`${emojis.bs}${stats.name}'s Brawl Stars stats`)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()//\nExperience: \`${curr}/${T}\`
          .addField(`Profile Stats:`, `Player Tag: **\`${stats.tag}\`**\nExperience Level: ${emojis.Experience}**\`${stats.expLevel}\`**\nCurrent Trophies: ${images}${emojis.Trophy}**\`${stats.trophies}\`**\nPower Play Points: ${emojis.PowerPlayPoints}**\`${stats.powerPlayPoints}\`**\nUnlocked Brawlers: ${emojis.Unlocked}**\`${stats.brawlers.length}\`**\n`, true)
          .addField(`Club:`, `Club Name: **\`${stats.club.name || 'None'}\`**\nClub Tag: **\`${stats.club.tag || 'None'}\`**\n**Highest's**\nHighest Trophies: ${emojis.Trophy}**\`${stats.highestTrophies}\`**\nHighest in Power Play: ${emojis.PowerPlayPoints || 'None'}**\`${stats.highestPowerPlayPoints || 'None'}\`**`, true)
          .addField(`Victories:`, `Total Victories: **\`${totalwins || 'None'}\`**\nSolo Victories: ${emojis.Solo}**\`${stats.soloVictories || 'None'}\`**\nDuo Victories: ${emojis.Duo}**\`${stats.duoVictories || 'None'}\`**\n3vs3 Victories: ${emojis["3v3"]}**\`${stats["3vs3Victories"] || 'None'}\`**\n`, true)
          .setColor(color);

        return message.channel.send(embed);
        } else if (stats.reason === 'notFound') {
            return message.channel.send(`Give me a valid Player tag`)
        } else {
            const shit = new MessageEmbed()
            .setDescription(`**Error:** \`${stats.reason}\`\n**Message:** \`${stats.message || 'None'}\``)
            return message.channel.send(shit)
        }
      } catch (err) {
        message.client.logger.error(err.stack);
        message.channel.send('Well something went wrong with my code.');
      }
  }
};
