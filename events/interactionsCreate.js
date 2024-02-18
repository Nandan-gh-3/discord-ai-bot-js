// events/interactionCreate.js
const c = require('../utils/colorUtils');

module.exports = {
    name: 'interactionCreate',
    once: false,
    execute(interaction) {
        console.log(`${c[1](`[${this.name}]`)} [${interaction.user.tag}] [${interaction}] [${interaction.guild.name}]`);
    },
};
