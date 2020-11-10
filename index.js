const config = require('./config.json');
const Client = require('./src/Client.js');
const { Intents } = require('discord.js');
const mongoose = require('mongoose')


global.__basedir = __dirname;

const intents = new Intents(Intents.ALL).remove([
    "DIRECT_MESSAGE_TYPING",
    "GUILD_MESSAGE_TYPING"
  ]);
const client = new Client(config, { ws: { intents: intents } });
client.mongoose = require('./mongoose')

function init() {
    client.loadEvents('./src/event(s)');
    client.loadCommands('./src/command(s)');
    client.login(client.token);
    client.mongoose.init();
  }
  
  init();
  
  process.on('unhandledRejection', err => client.logger.error(err));