const Discord = require('discord.js');
const { readdir, readdirSync } = require('fs')
const { join, resolve } = require('path');
const AsciiTable = require('ascii-table');
const mongoose = require('mongoose');

/**
 * Extending the Client
 * @extends
 */
class Client extends Discord.Client{
     /**
      * Required Parameters
      * @param {Object} secrets
      * @param {ClientOptions} options
      */
     constructor(secrets, options = {}) {

          super(options);

          /**
           * Logging to the console.
           */
          this.logger = require('./secondary/logger.js')

          /**
           * MongoDBURI
           */
          this.mongodburi = secrets.database.mongouri

          /** 
           * Collection of commands
           * @type {Collection<string, Command>}
           */
          this.commands = new Discord.Collection();

          /** 
          * Collection of command aliases
           * @type {Collection<string, Command>}
           */
          this.aliases = new Discord.Collection();

          /**
           * Bot's Login token
           */
          this.token = secrets.bot.token

          /**
           * API keys
           */
          this.API = secrets.apikeys

          /**
           * Bot Owners
           * @type {Array<String>}
           */
          this.owners = secrets.bot.owners

          /**
           * Bot Devs
           * @type {Array<String>}
           */
          this.devs = secrets.bot.devs

          /**
           * Channels
           * @type {Object}
           */
          this.logchannels = secrets.channels

          /**
           * Functions
           * @type {Object}
           */
          this.fns = require('./secondary/functions.js')

     }

  /**
   * Load all of the available events
   * @param {string} path 
   */
  loadEvents(path) {
    readdir(path, (err, files) => {
      if (err) this.logger.error(err);
      files = files.filter(f => f.split('.').pop() === 'js');
      if (files.length === 0) return this.logger.warn('No events found');
      this.logger.info(`${files.length} event(s) found...`);
      files.forEach(f => {
        const eventName = f.substring(0, f.indexOf('.'));
        const event = require(resolve(__basedir, join(path, f)));
        super.on(eventName, event.bind(null, this));
        delete require.cache[require.resolve(resolve(__basedir, join(path, f)))]; // Clear cache
        this.logger.info(`Loading event: ${eventName}`);
      });
    });

    return this;
  }
 
   /**
    * Loads Available commands
    * @param {string} path 
    */
   loadCommands(path) {
     this.logger.info('Command Initiation started...');
     let table = new AsciiTable('Commands');
    table.setHeading('File', 'Aliases', 'Status');
    readdirSync(path).filter( f => !f.endsWith('.js')).forEach( dir => {
      const commands = readdirSync(resolve(__basedir, join(path, dir))).filter(f => f.endsWith('js'));
      commands.forEach(f => {
        const Command = require(resolve(__basedir, join(path, dir, f)));
        const command = new Command(this); // Instantiate the specific command
        if (command.name && !command.disabled) {
          // Map command
          this.commands.set(command.name, command);
          // Map command aliases
          let aliases = '';
          if (command.aliases) {
            command.aliases.forEach(alias => {
              this.aliases.set(alias, command);
            });
            aliases = command.aliases.join(', ');
          }
          table.addRow(f, aliases, '(o)');
        } else {
          this.logger.warn(`${f} failed to load`);
          table.addRow(f, '', '', '( )');
          return;
        }
      });
    });
    this.logger.info(`\n${table.toString()}`);
    return this;
   }

   /**
    * Initiate Mongoose
    * @param {String} mongouri 
    */
   loadMongoose(mongouri) {
        this.logger.info('Initiating Mongoose...')
     const dbOptions = {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          autoIndex: false,
          poolSize: 5,
          connectTimeoutMS: 10000,
          family:4
      };
      mongoose.connect(mongouri, dbOptions);
      mongoose.set('useFindAndModify', false);
      
      mongoose.Promise = global.Promise;
      mongoose.connection.on('connected', () => {
          this.logger.info('Mongoose connected');
      });

      mongoose.connection.on('err', err => {
          this.logger.error(`Mongoose connection error: \n${err.stack}`);
      });

      mongoose.connection.on('disconnected', () => {
          this.logger.warn('Mongoose disconnected');
      });
   }

   /**
    * If user is Owner
    * @param {User} user 
    */
  isOwner(user) {
     if (this.owners.includes(user.id)) return true;
     else return false;
   }

   /**
    * If the user is a Dev
    * @param {User} user
    */
   isDev(user) {
        if (this.devs.includes(user.id)) return true;
        else if (this.owners.includes(user.id)) return true;
        else return false;
   }
 
}

module.exports = Client;