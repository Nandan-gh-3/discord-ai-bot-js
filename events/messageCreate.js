// events/messageCreate.js

const c = require('../utils/colorUtils');
const { generateStructured, generateFreeform } = require('../utils/gemini/geminiUtils');
const { send, reply, fetchEmojis, formatMentions } = require('../utils/helperUtils');
const fs = require('fs');

// Function to handle incoming messages
async function handleMessage(message) {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Define handlers for different conditions
    if (message.content.toLowerCase().startsWith(process.env.PREFIX)) {
        await handleCommandMessage(message);
        return;
    }

    if (message.mentions.has(message.client.user) && !message.reference) {
        await handleMentionMessage(message);
        return;
    }

    if (message.reference && message.reference.messageId) {
        const referencedMessage = await message.channel.messages.fetch(message.reference.messageId);
        if (referencedMessage.author.bot && referencedMessage.author.id === message.client.user.id) {
            await handleReplyMessage(message);
            return;
        }
    }
}

// Function to handle messages that are commands
async function handleCommandMessage(message, client) {
    console.log("handling command");
    // Parse command and arguments
    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
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
async function handleMentionMessage(ctx) {
    try {
        await ctx.channel.sendTyping();

        // sender
        const sender = ctx.author.username;

        // prompt
        let prompt = await formatMentions(ctx);

        // history
        const historyLimit = JSON.parse(fs.readFileSync('data.json').toString()).historyLimit || {};
        let history
        if (historyLimit[ctx.guild.id]) {
            const messages = await ctx.channel.messages.fetch({ limit: historyLimit[ctx.guild.id] + 1 });
            history = (await Promise.all(messages.map(async msg => (
                // (msg.author.globalName || msg.author.username) + " : " + await formatMentions(msg)
                (msg.author.username) + " : " + await formatMentions(msg)
            )))).reverse().slice(0, -1).join('\n');
        }

        // emojis
        const emojis = fetchEmojis(ctx.guild);

        // format the prompt according to history
        if (history) {
            prompt = `--- start of conversation ---\n${history}\n--- end of conversation ---\n\nQuery - ${prompt}\n Respond to this query in 1 to 3 short sentences. Take any context if needed from the above conversation. Do not repeat anything as it is from the conversation. Use monke slang. Do not separate answer in points. Your name is MONKE in this conversation.`;
        }

        //format the prompt if there is no history
        if (!history) {
            prompt = `${prompt}\n Respond to this query in short. Do not repeat anything. Use monke slang. Do not separate answer in points.`
        }

        console.log("\nprompt\n", prompt);
        const generatedResponse = await generateFreeform(prompt);
        // Send the generated response
        await reply(ctx, generatedResponse);
    } catch (error) {
        console.error('Error while generating or sending response:', error);
    }
}

async function handleReplyMessage(message) {
    console.log("handling reply");
    const refChain = [];
    let reference = message.reference.messageId;

    while (reference) {
        const msg = await message.channel.messages.fetch(reference);
        refChain.push(msg);
        reference = msg.reference?.messageId;
    }
    let prompt = await `--- start of conversation ---\n ${refChain.map(msg => `${msg.author.username} : ${formatMentions(msg)}`).reverse().join('\n')}\n--- end of conversation ---\n\nQuery : ${message.content}\n Respond to this query in 1 to 3 short sentences. Take any context if needed from the above conversation. Do not repeat anything as it is from the conversation. Use monke slang. Do not separate answer in points. Your name is MONKE in this conversation.`;

    const response = await generateFreeform(prompt);
    await reply(message, response);
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
