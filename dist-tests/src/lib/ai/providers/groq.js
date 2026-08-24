"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groqProvider = exports.GroqProvider = void 0;
const groq_1 = require("@ai-sdk/groq");
const ai_1 = require("ai");
const FLOWRA_SYSTEM_PROMPT = "You are Flowra AI, an expert automation workflow assistant. Help the user build, debug, and configure automations. Be concise and professional.";
/**
 * Groq implementation of the AIProvider abstraction.
 * This is the ONLY file in the application that imports from @ai-sdk/groq.
 * If GROQ_API_KEY is not set, `isAvailable` is false and the rest of the
 * application must handle this gracefully.
 */
class GroqProvider {
    name = "groq";
    isAvailable;
    client = null;
    constructor() {
        const apiKey = process.env.GROQ_API_KEY;
        if (apiKey && apiKey.trim() !== "") {
            this.client = (0, groq_1.createGroq)({ apiKey });
            this.isAvailable = true;
        }
        else {
            this.isAvailable = false;
        }
    }
    async streamText({ messages, systemPrompt }) {
        if (!this.client) {
            throw new Error("AI_PROVIDER_UNAVAILABLE");
        }
        const result = (0, ai_1.streamText)({
            model: this.client("llama3-8b-8192"),
            messages: [
                { role: "system", content: systemPrompt ?? FLOWRA_SYSTEM_PROMPT },
                ...messages,
            ],
        });
        // createUIMessageStreamResponse is compatible with DefaultChatTransport on the client
        return (0, ai_1.createUIMessageStreamResponse)({
            stream: result.toUIMessageStream(),
        });
    }
    async generateText({ messages, systemPrompt }) {
        if (!this.client) {
            throw new Error("AI_PROVIDER_UNAVAILABLE");
        }
        const result = await (0, ai_1.generateText)({
            model: this.client("llama3-8b-8192"),
            messages: [
                { role: "system", content: systemPrompt ?? FLOWRA_SYSTEM_PROMPT },
                ...messages,
            ],
        });
        return result.text;
    }
}
exports.GroqProvider = GroqProvider;
// Singleton instance — server-side only
exports.groqProvider = new GroqProvider();
