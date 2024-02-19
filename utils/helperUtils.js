// utils/helperUtils.js

// Function to fetch emojis in a guild
function fetchEmojis(guild) {
    return guild.emojis.cache.map(emoji => emoji.toString());
}

// Function to send message or chunks depending on length
async function send(channel, messageContent) {
    // Split the message into chunks that are close to 2000 characters but do not exceed it
    const chunks = [];
    let currentChunk = '';
    
    // Split the message content into words
    const words = messageContent.split(' ');
    
    // Iterate over each word and add it to the current chunk
    for (const word of words) {
        // Check if adding the current word to the chunk would exceed the character limit
        if ((currentChunk + word).length > 2000) {
            // If it exceeds the limit, push the current chunk to the chunks array
            chunks.push(currentChunk.trim());
            // Start a new chunk with the current word
            currentChunk = `${word} `;
        } else {
            // If it doesn't exceed the limit, add the word to the current chunk
            currentChunk += `${word} `;
        }
    }

    // Push the last chunk to the chunks array
    chunks.push(currentChunk.trim());

    // Send each chunk separately
    for (const chunk of chunks) {
        await channel.send(chunk);
    }
}
// Function to replace mentions with their corresponding names
async function replaceMentions(message, content) {
    const rolesRegex = /<@&(\d+)>/g;
    const usersRegex = /<@!?(\d+)>/g;

    const replaceRoleMentions = async (content) => {
        const roleMentions = content.match(rolesRegex);
        if (roleMentions) {
            for (const mention of roleMentions) {
                const roleId = mention.match(/\d+/)[0];
                const role = message.guild.roles.cache.get(roleId);
                if (role) {
                    content = content.replace(mention, `@${role.name}`);
                }
            }
        }
        return content;
    };

    const replaceUserMentions = async (content) => {
        const userMentions = content.match(usersRegex);
        if (userMentions) {
            for (const mention of userMentions) {
                const userId = mention.match(/\d+/)[0];
                const userObject = await message.client.users.fetch(userId);
                if (userObject) {
                    content = content.replace(mention, `@${userObject.username}`);
                }
            }
        }
        return content;
    };

    content = await replaceRoleMentions(content);
    content = await replaceUserMentions(content);

    return content;
}

module.exports = { fetchEmojis, send, replaceMentions };
