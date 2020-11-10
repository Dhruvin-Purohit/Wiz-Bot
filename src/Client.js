const Discord = require('discord.js');
const { readdir, readdirSync } = require('fs');
const { join, resolve } = require('path');
const AsciiTable = require('ascii-table');

/**
 * Setup of the client
 * @extends Discord.Client
 */
class Client extends Discord.Client {

  /**
   * New client
   * @param {Object} config 
   * @param {ClientOptions} options 
   */
  constructor(config, options = {}) {
    
    super(options);

    /**
     * Logger
     */
    this.logger = require('./utils/logger.js');

    /**
     * Possible command types
     * @type {Object}
     */
    this.types = {
      INFO: 'info',
      FUN: 'fun',
      STATS: 'stats',
      MISC: 'misc',
      MOD: 'mod',
      SETUP: 'setup',
      OWNER: 'owner'
    };

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
     * Bot's token
     * @type {string}
     */
    this.token = config.token;

    /** 
     * Bot Owner ID
     * @type {string}
     */
    this.ownerId = config.ownerid;

    /** 
     * Bug channel ID
     * @type {string}
     */
    this.bugID = config.bugID;

    /** 
     * Feedback channel ID
     * @type {string}
     */
    this.feedbackID = config.feedbackID;

    /** 
     * Log channel ID
     * @type {string}
     */
    this.logID = config.logID;

    /** 
     * My functions
     * @type {Object}
     */
    this.utils = require('./utils/functions.js');

    this.logger.info('Initializing...');

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
   * Load all of the available commands
   * @param {string} path 
   */
  loadCommands(path) {
    this.logger.info('Loading commands...');
    let table = new AsciiTable('Commands');
    table.setHeading('File', 'Aliases', 'Type', 'Status');
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
          table.addRow(f, aliases, command.type, 'pass');
        } else {
          this.logger.warn(`${f} failed to load`);
          table.addRow(f, '', '', 'fail');
          return;
        }
      });
    });
    this.logger.info(`\n${table.toString()}`);
    return this;
  }

  /**
   * Checks if user is the bot owner
   * @param {User} user 
   */
  isOwner(user) {
    if (user.id === this.ownerId) return true;
    else return false;
  }
}

module.exports = Client;