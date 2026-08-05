import ai from "../ai/gemini.js";

export const chatWithGemini = async (message) => {
    const response = await ai.models.generateContent({
        model:"gemini-2.5-flash",
        contents: message,
    });
    return response.text;
};
