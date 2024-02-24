// commands/spy.js
const fs = require('fs');

module.exports = {
    name: 'spy',
    description: 'sets history limit',
    async execute(message, args) {
        const guildID = message.guild.id;
        const data = JSON.parse(fs.readFileSync('data.json').toString());
        data.historyLimit = { ...data.historyLimit, [guildID]: Number(args[0]) };
        fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
        if (Number(args[0]) === 0) {
            await message.react('❌');
        } else {
            await message.react('✅');
        }
        setTimeout(() => {
            message.delete();
        }, 600);
    },
};