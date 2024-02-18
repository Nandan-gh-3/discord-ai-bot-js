// events/messageReactionAdd.js
const c = require('../utils/colorUtils');

// Function to handle reactions
async function handleReaction(reaction, user) {
    // Ignore reactions from bots
    if (user.bot) return;
    // Ignore reactions from the user, if he is reacting to another user but not a bot
    if (!reaction.message.author.bot) return;

    // Check if the reaction emoji is ❌
    if (reaction.emoji.name === '❌') {
        try {
            // Delete the message
            await reaction.message.delete();
        } catch (error) {
            console.error(`Error deleting message: ${error}`);
        }
    }
}

// Exporting the messageReactionAdd event handler
module.exports = {
    name: 'messageReactionAdd',
    once: false,
    async execute(reaction, user) {
        // Log the reaction
        console.log(`${c[2](`[${this.name}]`)} [${user.tag}] [${reaction.emoji.name}] [${reaction.message.content}] [${reaction.message.guild.name}]`);
        // Handle reactions
        await handleReaction(reaction, user);
    },
};
