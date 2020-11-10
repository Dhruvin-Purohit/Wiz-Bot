const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');
const User = require('../../schema(s)/user');
const fetch = require('node-fetch');
const config = require('../../../config.json');
const league = require('../../utils/trophiesmap.json')

module.exports = class BsStatsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'cocstats',
      aliases: ['clashofclansstats', "coc"],
      usage: 'cocstats <player_tag>',
      description: oneLine`
        Sets the prefix for your server.
        Provide no prefix to set the default
      `,
      type: client.types.SETUP,
      userPermissions: ['SEND_MESSAGES'],
      examples: ['bsstats #0000000']
    });
  }
  async run(message, args) {

    const token = config.cocapi;
    
    let user = await User.findOne({userID: message.author.id})

    if (args[0]) {

    let tag = args[0]

    const rgx = /^#?[0-9A-Z]/i;

    const failembed = new MessageEmbed()
    .setDescription(`${emojis.Angry} Give a Valid Player Tag`);

    if (!rgx.test(tag)) return message.channel.send(failembed)
    if (tag.startsWith('#')) tag = tag.slice(1);

    try {
        const res = await fetch(`https://cocproxy.royaleapi.dev/v1/players/%23${tag}`, { headers: {'Authorization': `Bearer ${token}`}});
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
          .setTitle(`${emojis.coc}${stats.name}'s Clash Of Clans stats`)
          .setThumbnail(images)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()//\nExperience: \`${curr}/${T}\`
          //.addField(`Profile Stats:`, `Player Tag: **\`${stats.tag}\`**\nExperience Level: ${emojis.Experience}**\`${stats.expLevel}\`**\nCurrent Trophies: ${emojis.Trophies}**\`${stats.trophies}\`**\nDonated: ${emojis.PowerPlayPoints}**\`${stats.donations}\`**\nRecieved: ${emojis.Unlocked}**\`${stats.donationsReceived}\`**\n`, true)
          //.addField(`Clan:`, `Clan Name: **\`${stats.clan.name}\`**\nClub Tag: **\`${stats.clan.tag}\`**\n**Highest's**\nHighest Trophies: ${emojis.Trophies}**\`${stats.bestTrophies}\`**\nLegend Trophies: ${emojis.PowerPlayPoints}**\`${stats.legendTrophies}\`**`, true)
          .addField(`\u200B`, `\u200B`)
          //.addField(`Victories:`, `Attack Victories: **\`${stats.attackWins}\`**\nDefense Victories: ${emojis.Solo}**\`${stats.defenseWins}\`**\nVersus Battle Victories: ${emojis.Duo}**\`${stats.versusBattleWins}\`**\n3vs3 Victories: ${emojis["3v3"]}**\`${stats["3vs3Victories"]}\`**\n`, true)
          .setColor(color);

        return message.channel.send(embed);
        } else if (stats.reason === 'notFound') {
            const nofind = new MessageEmbed()
            .setDescription(`${emojis.Sad} Give me a valid Player tag`)
            return message.channel.send(nofind)
        } else {
            const shit = new MessageEmbed()
            .setDescription(`**Error:** \`${stats.reason}\`\n**Message:** \`${stats.message || 'None'}\``)
            return message.channel.send(shit)
        }
      } catch (err) {
        message.client.logger.error(err.stack);
        this.sendErrorMessage(message, 1, 'Please try again in a few seconds', err.message);
      }

    } else if (user.bstag) {

    let tag = user.bstag

    const rgx = /^#?[0-9A-Z]/i;

    const failembed = new MessageEmbed()
    .setDescription(`${emojis.Angry} The player tag linked to your account is incorrect.`);

    if (!rgx.test(tag)) return message.channel.send(failembed)
    if (tag.startsWith('#')) tag = tag.slice(1);

    try {
        const res = await fetch(`https://bsproxy.royaleapi.dev/v1/players/%23${tag}`, { headers: {'Authorization': `Bearer ${token}`}});
        const stats = await res.json();
        if (!stats.reason) {

        let color = stats.nameColor.slice(4)
        color = '#' + color

        let totalwins = stats.soloVictories + stats.duoVictories + stats["3vs3Victories"];

        let images;
            const entries = Object.entries(league);
            entries.forEach(entry => {
              // entry[0] is the key, entry[1] is the value.
              if(stats.trophies > entry[0]) images = entry[1];
            });

        const urembed = new MessageEmbed()
        .setTitle(`${emojis.bs}${stats.name}'s Brawl Stars stats`)
        .setThumbnail(images)
        //.setImage(images)removed because too large image
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()//\nExperience: \`${curr}/${T}\`
        .addField(`Profile Stats:`, `Player Tag: **\`${stats.tag}\`**\nExperience Level: ${emojis.Experience}**\`${stats.expLevel}\`**\nCurrent Trophies: ${emojis.Trophy}**\`${stats.trophies}\`**\nPower Play Points: ${emojis.PowerPlayPoints}**\`${stats.powerPlayPoints}\`**\nUnlocked Brawlers: ${emojis.Unlocked}**\`${stats.brawlers.length}\`**\n`, true)
        .addField(`Club:`, `Club Name: **\`${stats.club.name}\`**\nClub Tag: **\`${stats.club.tag}\`**\n**Highest's**\nHighest Trophies: ${emojis.Trophy}**\`${stats.highestTrophies}\`**\nHighest in Power Play: ${emojis.PowerPlayPoints}**\`${stats.highestPowerPlayPoints}\`**`, true)
        .addField(`\u200B`, `\u200B`)
        .addField(`Victories:`, `Total Victories: **\`${totalwins}\`**\nSolo Victories: ${emojis.Solo}**\`${stats.soloVictories}\`**\nDuo Victories: ${emojis.Duo}**\`${stats.duoVictories}\`**\n3vs3 Victories: ${emojis["3v3"]}**\`${stats["3vs3Victories"]}\`**\n`)
        .setColor(color);

        return message.channel.send(urembed);
        } else if (stats.reason === 'notFound') {
            const nofind = new MessageEmbed()
            .setDescription(`${emojis.Sad} The tag linked to your account is Invalid.`)
            return message.channel.send(nofind)
        } else {
            const shit = new MessageEmbed()
            .setDescription(`Error: \`${stats.reason}\`\nMessage: \`${stats.message || 'None'}\``)
        }
      } catch (err) {
        message.client.logger.error(err.stack);
        this.sendErrorMessage(message, 1, 'Please try again in a few seconds', err.message);
      }



    } else {
        const notspecified = new MessageEmbed()
        .setDescription(`${emojis.Angry}Give me a valid Player Tag to search for.\nOr link your player tag to your account.`);

        return message.channel.send(notspecified)
    }
  }
};
