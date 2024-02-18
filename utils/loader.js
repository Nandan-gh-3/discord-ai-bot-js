// utils/loader.js

const fs = require('fs').promises;

async function loadCommands(client) {
    try {
        // Initialize client.commands as a Map if it's not already initialized
        if (!client.commands) {
            client.commands = new Map();
        }

        const commandFiles = await fs.readdir('./commands');
        for (const file of commandFiles) {
            if (file.endsWith('.js')) {
                const command = require(`../commands/${file}`);
                client.commands.set(command.name, command);
            }
        }
    } catch (error) {
        console.error('Error loading commands:', error);
        throw error;
    }
}

async function loadEvents(client) {
    try {
        const eventFiles = await fs.readdir('./events');
        for (const file of eventFiles) {
            if (file.endsWith('.js')) {
                const event = require(`../events/${file}`);
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    // Update to use messageCreate if the event name is message
                    const eventName = event.name === 'message' ? 'messageCreate' : event.name;
                    client.on(eventName, (...args) => event.execute(...args, client));
                }
            }
        }
    } catch (error) {
        console.error('Error loading events:', error);
        throw error;
    }
}

module.exports = { loadCommands, loadEvents };
