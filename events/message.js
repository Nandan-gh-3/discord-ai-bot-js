// events/message.js

module.exports = {
    name: 'message',
    execute(message) {
        const MAX_CHARACTERS = 2000;
        const content = message.content;

        // Check if the message content exceeds the maximum character limit
        if (content.length > MAX_CHARACTERS) {
            // Split the content into chunks
            const chunks = content.match(/[\s\S]{1,2000}/g);

            // Send each chunk as a separate message
            chunks.forEach(chunk => {
                message.channel.send(chunk);
            });
        }
    },
};
