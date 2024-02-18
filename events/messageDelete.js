// events/messageDelete.js
const c = require('../utils/colorUtils');

module.exports = {
    name: 'messageDelete',
    once: false,
    execute(message) {
        console.log(`${c[1](`[${this.name}]`)} [${message.author.tag}] [${message.content}] [${message.guild.name}]`);
    },
};
