// events/guildMemberAdd.js
const c = require('../utils/colorUtils');

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    execute(member) {
        console.log(`${c[1](`[${this.name}]`)} [${member.user.tag}] [${member.guild.name}]`);
    },
};
