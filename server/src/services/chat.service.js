import ai from "../ai/gemini.js";

export const chatWithGemini = async (message, context = null) => {
    let prompt;

    if (context) {
        // RAG mode — DB data available, answer using context
        prompt = `You are a helpful AI assistant for DevConnect, an e-commerce platform for developers.
You have access to the user's real-time data from the database.

Database Context:
${context}

User Question: ${message}

Instructions:
- Answer the user's question using the database context above.
- Be concise, friendly, and helpful.
- Format numbers as currency (₹) where applicable.
- If the context doesn't fully answer the question, you can add helpful general advice too.`;
    } else {
        // General mode — no DB data needed, answer normally
        prompt = `You are a helpful AI assistant for DevConnect, an e-commerce platform for developers.
Answer the user's question in a friendly, concise, and helpful manner.
You can help with general questions, coding, shopping advice, platform guidance, or anything else.

User: ${message}`;
    }

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
    });
    return response.text;
};
