// commands/emojis.js
const { fetchEmojis, send } = require('../utils/helperUtils');

module.exports = {
    name: 'emojis',
    description: 'Display emojis',
    execute(message) {
        // Fetch the emojis in the guild
        const emojis = fetchEmojis(message.guild);

        // If there are no emojis, send a message indicating so
        if (emojis.length === 0) {
            return message.channel.send('There are no emojis in this server.');
        }

        // Send the list of emojis
        send(message.channel, emojis.map(emoji => emoji.toString()).join(' '));
    },
};
