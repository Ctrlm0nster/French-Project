import Groq from "groq-sdk";

const DEFAULT_MODEL = "llama-3.3-70b-versatile";
const ALLOWED_MODELS = new Set([
    DEFAULT_MODEL,
    "llama-3.1-8b-instant",
    "llama3-70b-8192",
    "llama3-8b-8192",
]);
const MAX_MESSAGES = 24;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_TOTAL_CHARACTERS = 20000;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 12;
const rateLimitStore = new Map();

function getClientIp(req) {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string" && forwarded.trim()) {
        return forwarded.split(",")[0].trim();
    }
    return req.socket?.remoteAddress || "unknown";
}

function isRateLimited(clientIp) {
    const now = Date.now();
    const entries = (rateLimitStore.get(clientIp) || []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

    if (entries.length >= RATE_LIMIT_MAX_REQUESTS) {
        rateLimitStore.set(clientIp, entries);
        return true;
    }

    entries.push(now);
    rateLimitStore.set(clientIp, entries);
    return false;
}

function validateMessages(messages) {
    if (!Array.isArray(messages) || messages.length === 0) {
        return "Invalid messages format";
    }
    if (messages.length > MAX_MESSAGES) {
        return `Too many messages. Maximum allowed is ${MAX_MESSAGES}.`;
    }

    let totalCharacters = 0;
    for (const message of messages) {
        const role = String(message?.role || "");
        const content = String(message?.content || "");

        if (!["system", "user", "assistant"].includes(role)) {
            return "Invalid message role";
        }
        if (!content.trim()) {
            return "Message content cannot be empty";
        }
        if (content.length > MAX_MESSAGE_LENGTH) {
            return `Each message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`;
        }

        totalCharacters += content.length;
    }

    if (totalCharacters > MAX_TOTAL_CHARACTERS) {
        return `Conversation is too large. Maximum total length is ${MAX_TOTAL_CHARACTERS} characters.`;
    }

    return null;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages, model } = req.body;
    const apiKey = process.env.GROQ_API_KEY;
    const clientIp = getClientIp(req);

    const validationError = validateMessages(messages);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    if (isRateLimited(clientIp)) {
        return res.status(429).json({
            error: "Rate limit exceeded. Please wait a minute before trying again."
        });
    }

    if (!apiKey) {
        return res.status(500).json({
            error: 'Server misconfiguration: GROQ_API_KEY is not set in Vercel environment variables.'
        });
    }

    const requestedModel = typeof model === "string" ? model.trim() : "";
    if (requestedModel && !ALLOWED_MODELS.has(requestedModel)) {
        return res.status(400).json({
            error: `Unsupported model. Allowed models: ${Array.from(ALLOWED_MODELS).join(", ")}`
        });
    }

    const groq = new Groq({ apiKey });

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: requestedModel || DEFAULT_MODEL,
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
