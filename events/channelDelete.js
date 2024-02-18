// events/channelDelete.js
const c = require('../utils/colorUtils');

module.exports = {
    name: 'channelDelete',
    once: false,
    execute(channel) {
        console.log(`${c[1](`[${this.name}]`)} [${channel.name}] [${channel.guild.name}]`);
    },
};
