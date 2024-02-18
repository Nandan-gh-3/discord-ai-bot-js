// commands/say.js

module.exports = {
    name: 'say',
    description: 'Says something!',
    execute(message, args) {
        const sayMessage = args.join(' ');
        message.delete(); // asynchronus
        message.channel.send(sayMessage); // asynchronus
    },
};
