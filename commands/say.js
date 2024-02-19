// commands/say.js

module.exports = {
    name: 'say',
    description: 'Says something!',
    async execute(message, args) {
        const sayMessage = args.join(' ');

        try {
            // Attempt to delete the original message and send the new message
            await Promise.all([
                message.delete(),
                message.channel.send(sayMessage)
            ]);
        } catch (error) {
            console.error('Error:', error);
            // Log any errors that occur during message deletion or sending
        }
    },
};
