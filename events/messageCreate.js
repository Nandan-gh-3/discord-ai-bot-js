// events/messageCreate.js

const c = require('../utils/colorUtils');
const { prefix } = require('../config/config.json');

// Function to handle incoming messages
async function handleMessage(message) {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Define handlers for different conditions
    const handlers = new Map([
        [message.content.startsWith(prefix), handleCommandMessage], // Check if the message starts with the prefix
        [message.mentions.has(message.client.user), handleMentionMessage] // Check if the bot is mentioned
    ]);

    // Iterate over each entry in the map and execute the handler for the first condition that evaluates to true
    for (const [condition, handler] of handlers) {
        if (condition) {
            await handler(message); // Execute the handler
            break; // Exit loop after handling the first condition
        }
    }
}

// Function to handle messages that are commands
async function handleCommandMessage(message) {
    // Parse command and arguments
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = message.client.commands.get(commandName);

    // If command exists, execute it
    if (command) {
        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            message.reply('There was an error while executing this command.');
        }
    }
}

// Function to handle messages where the bot is mentioned
async function handleMentionMessage(message) {
    try {
        // Send typing indicator
        await message.channel.sendTyping();
        // Send a greeting message
        await message.channel.send('Hello! How can I assist you?');
    } catch (error) {
        console.error('Error while sending typing indicator or greeting message:', error);
    }
}

// Exporting the messageCreate event handler
module.exports = {
    name: 'messageCreate',
    once: false,
    execute(message) {
        // Log the received message
        console.log(`${c[2](`[${this.name}]`)} [${message.author.tag}] [${message.content}] [${message.guild.name}]`);
        // Handle incoming messages
        handleMessage(message);
    },
};
