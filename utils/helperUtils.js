// utils/helperUtils.js

// Function to fetch emojis in a guild
function fetchEmojis(guild) {
    return guild.emojis.cache.map(emoji => emoji.toString());
}

function chunkMessage(messageContent) {
    const maxChunkLength = 2000;
    const chunks = [];
    let currentChunk = '';

    for (const word of messageContent.split(' ')) {
        if ((currentChunk + word).length > maxChunkLength) {
            chunks.push(currentChunk.trim());
            currentChunk = `${word} `;
        } else {
            currentChunk += `${word} `;
        }
    }

    chunks.push(currentChunk.trim());

    return chunks;
}

async function send(channel, messageContent) {
    const chunks = chunkMessage(messageContent);
    for (const chunk of chunks) {
        await channel.send(chunk);
    }
}

async function reply(message, replyContent) {
    const chunks = chunkMessage(replyContent);
    for (const chunk of chunks) {
        await message.reply(chunk);
    }
}

function formatMentions(ctx) {
    let content = removeClientMention(ctx.content);
    return content.replaceAll(/<@!?(\d+)>/g, (match, id) => {
        const user = ctx.client.users.cache.get(id);
        if (user) {
            return `@${user.username}`;
        } else {
            return match;
        }
    });
}

function removeClientMention(content) {
    return content.replaceAll('<@1192520170166558841>', '').trim();
}


module.exports = { fetchEmojis, send,reply, formatMentions };
