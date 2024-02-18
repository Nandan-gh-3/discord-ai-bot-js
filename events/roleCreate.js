// events/roleCreate.js
const c = require('../utils/colorUtils');

module.exports = {
    name: 'roleCreate',
    once: false,
    execute(role) {
        console.log(`${c[2](`[${this.name}]`)} [${role.name}] [${role.guild.name}] `);
    },
};
