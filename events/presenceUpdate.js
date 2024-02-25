// events/presenceUpdate.js
const c = require('../utils/colorUtils');

module.exports = {
    name: 'presenceUpdate',
    once: false,
    execute(oldPresence, newPresence) {
       // console.log(`${c[4](`[${this.name}]`)} [${newPresence.user.tag}] [${oldPresence?.status || 'Unknown'}->${newPresence?.status}] [${newPresence.guild.name}]`);
    },
};
