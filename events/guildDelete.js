// events/guildDelete.js

const fs = require('fs').promises;

module.exports = {
    name: 'guildDelete',
    once: false,
    async execute(guild) {
        console.log(`Left guild: ${guild.name}`);
        try {
            // Load the existing emojis data from data.json
            const emojisData = require('../data.json');
            // Remove the emojis data for the guild that was left
            delete emojisData.emojis[guild.id];
            // Write the updated emojis data back to data.json
            await fs.writeFile('./data.json', JSON.stringify(emojisData, null, 2));
            console.log(`Emojis removed for guild: ${guild.name}`);
        } catch (error) {
            console.error('Error removing emojis for guild:', error);
        }
    },
};
