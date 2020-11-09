const secrets = require('./secrets.json');
const Client = require('./src/Client.js');
const { Intents } = require('discord.js');

global.__basedir = __dirname;

const intents = new Intents()
intents.add(
     'GUILDS',
     'GUILD_MEMBERS',
     'GUILD_MESSAGES'
);
const client = new Client(secrets, { ws: { intents: intents } });

function init() {
     client.loadEvents('./src/event(s)');
     client.loadCommands('./src/command(s)');
     client.loadMongoose(client.mongodburi)
     client.login(client.token);
   }
   
init();
   
   process.on('unhandledRejection', err => client.logger.error(err));