// commands/ping.js

module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(message, args) {
        message.channel.send(`${message.client.ws.ping}ms`);
    },
};
