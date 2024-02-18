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

module.exports = { fetchEmojis, send };
