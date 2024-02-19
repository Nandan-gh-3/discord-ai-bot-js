// utils/gemini/geminiUtils.js
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = require("../../config/config.json").geminiToken;

async function generateContent(user, prompt, emojis, history) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
    ];
    const parts = [
        { text: "secret-instruction:You are a bot (@Monke) in a discord server, always be truthful, and accurate." },
        { text: "output:Sure!" },
        ...(emojis && emojis.length ? [{ text: "secret-instruction:You can use emojis like this: " + emojis.join(" ") }] : []),
        ...(emojis && emojis.length ? [{ text: "output:Ok i will use these emojis." }] : []),
        ...(history && history.length ? history : [{ text: `${user}:${prompt}` }]),
        { text: "output:" },
    ];
    
    console.log(parts);

    const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
    });

    return result.response.text();
}

module.exports = { generateContent };  
