// events/ready.js
const c = require('../utils/colorUtils');
const fs = require('fs');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`${c[2](`[${this.name}]`)} [${client.user.tag}]`);
    },
};
