import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages, model } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid messages format' });
    }

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: model || "llama-3.3-70b-versatile",
        });

        res.status(200).json(chatCompletion);
    } catch (error) {
        console.error("Groq API Error:", error);
        res.status(error.status || 500).json({ 
            error: error.message || "An error occurred during the request" 
        });
    }
}
