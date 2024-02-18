// events/voiceStateUpdate.js
const c = require('../utils/colorUtils');

module.exports = {
    name: 'voiceStateUpdate',
    once: false,
    execute(oldState, newState) {
        console.log(`${c[1](`[${this.name}]`)} [${newState.member.user.tag}] [${oldState.channel?.name || 'None'}->${newState.channel?.name || 'None'}] [${newState.guild.name}]`);
    },
};
