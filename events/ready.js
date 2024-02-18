// events/ready.js
const c = require('../utils/colorUtils');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`${c[2](`[${this.name}]`)} [${client.user.tag}]`);
    },
};
