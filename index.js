// index.js

const { Client, Intents } = require('discord.js');
const { discordToken } = require('./config/config.json');
const { loadCommands, loadEvents } = require('./utils/loader');

// Create a new Discord client
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_INVITES
    ]
});

// Asynchronous function to initialize the bot
(async () => {
    try {
        // Load commands if not already loaded
        if (!module.exports.commands) {
            module.exports.commands = await loadCommands(client);
        }

        // Load events if not already loaded
        if (!module.exports.events) {
            module.exports.events = await loadEvents(client);
        }

        // Login to Discord
        await client.login(discordToken);
        console.log('Bot logged in successfully.');
    } catch (error) {
        console.error('Error initializing bot:', error);
        process.exit(1);
    }
})();