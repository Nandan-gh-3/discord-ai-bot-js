// events/messageCreate.js

const c = require('../utils/colorUtils');
const { prefix } = require('../config/config.json');
const { generateContent } = require('../utils/gemini/geminiUtils');
const { send, fetchEmojis } = require('../utils/helperUtils');

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
async function handleCommandMessage(message, client) {
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

// Function to replace mentions with their corresponding names
async function replaceMentions(message, content) {
    const rolesRegex = /<@&(\d+)>/g;
    const usersRegex = /<@!?(\d+)>/g;

    const replaceRoleMentions = async (content) => {
        const roleMentions = content.match(rolesRegex);
        if (roleMentions) {
            for (const mention of roleMentions) {
                const roleId = mention.match(/\d+/)[0];
                const role = message.guild.roles.cache.get(roleId);
                if (role) {
                    content = content.replace(mention, `@${role.name}`);
                }
            }
        }
        return content;
    };

    const replaceUserMentions = async (content) => {
        const userMentions = content.match(usersRegex);
        if (userMentions) {
            for (const mention of userMentions) {
                const userId = mention.match(/\d+/)[0];
                const userObject = await message.client.users.fetch(userId);
                if (userObject) {
                    content = content.replace(mention, `@${userObject.username}`);
                }
            }
        }
        return content;
    };

    content = await replaceRoleMentions(content);
    content = await replaceUserMentions(content);

    return content;
}

// Function to handle messages where the bot is mentioned
async function handleMentionMessage(message) {
    try {
        // Send typing indicator
        await message.channel.sendTyping();

        // Generate content using Gemini AI
        const user = message.author.username;
        let prompt = message.content; // Change const to let for reassignment

        // Replace mentions with their corresponding names
        prompt = await replaceMentions(message, prompt);

        // Fetch the last 12 messages from the channel
        const messages = await message.channel.messages.fetch({ limit: 12 });

        // Extract the text content of each message, ensuring mentions are replaced with usernames and role names
        let history = await Promise.all(messages.map(async msg => ({
            text: `${msg.author.username == "MONKE" ? 'output' : msg.author.globalName}:${await replaceMentions(message, msg.content)}`
        })));
        history = history.reverse();

        const emojis = fetchEmojis(message.guild); // Fetch emojis in the guild
        const generatedResponse = await generateContent(user, prompt, emojis, history);

        // Send the generated response
        await send(message.channel, generatedResponse);
    } catch (error) {
        console.error('Error while generating or sending response:', error);
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
