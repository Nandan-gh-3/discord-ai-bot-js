// events/channelCreate.js
const c = require('../utils/colorUtils');

module.exports = {
    name: 'channelCreate',
    once: false,
    execute(channel) {
        console.log(`${c[2](`[${this.name}]`)} [${channel.name}] [${channel.guild.name}]`);
    },
};
