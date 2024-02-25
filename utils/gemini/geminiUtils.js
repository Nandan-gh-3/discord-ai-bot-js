// utils/gemini/geminiUtils.js
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const { geminiToken } = require("../../config/config.json");
const genAI = new GoogleGenerativeAI(geminiToken);
const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

const generationConfig = { temperature: 0.9, topK: 1, topP: 1, maxOutputTokens: 2048 };

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

async function generateStructured(user, prompt, emojis, history) {
    // stitch user prompt emojis and history together in parts
    const parts = [
        { text: "secret-instruction:You are a bot (@Monke) in a discord server, always be truthful, and accurate." },
        { text: "output:Sure!" },
        ...(emojis && emojis.length ? [{ text: "secret-instruction:You can use emojis like this: " + emojis.join(" ") }] : []),
        ...(emojis && emojis.length ? [{ text: "output:Ok i will use these emojis." }] : []),
        ...(history && history.length ? history : [{ text: `${user}:${prompt}` }]),
        { text: "output:" },
    ];

    const result = await model.generateContent({ contents: [{ role: "user", parts }], generationConfig, safetySettings });
    return result.response.text();
}

async function generateFreeform(prompt) {
    console.log("\n\n",prompt ,"\n\n");
    const parts = [{ text: prompt }];
    const result = await model.generateContent({ contents: [{ role: "user", parts }], generationConfig, safetySettings });
    return result.response.text();
}

module.exports = { generateStructured, generateFreeform };