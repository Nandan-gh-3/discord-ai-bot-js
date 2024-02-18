// events/guildCreate.js

module.exports = {
    name: 'guildCreate',
    once: false,
    execute(guild, client) {
        console.log(`Joined new guild: ${guild.name}`);
    },
};
