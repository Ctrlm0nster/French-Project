import Groq from "groq-sdk";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages, model } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid messages format' });
    }

    if (!apiKey) {
        return res.status(500).json({
            error: 'Server misconfiguration: GROQ_API_KEY is not set in Vercel environment variables.'
        });
    }

    const groq = new Groq({ apiKey });

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: model || "llama-3.3-70b-versatile",
        });

        res.status(200).json(chatCompletion);
    } catch (error) {
        console.error("Groq API Error:", error);
        const causeCode = error && error.cause && error.cause.code ? String(error.cause.code) : '';
        const transientNetworkError = ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN'].includes(causeCode);

        res.status(transientNetworkError ? 503 : (error.status || 500)).json({
            error: transientNetworkError
                ? `Network error while contacting Groq (${causeCode}). Please retry.`
                : (error.message || "An error occurred during the request")
        });
    }
}
