"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maxDuration = void 0;
exports.POST = POST;
const groq_1 = require("@/lib/ai/providers/groq");
const api_response_1 = require("@/lib/api-response");
exports.maxDuration = 30;
async function POST(req) {
    // Guard: if no AI provider is configured, return a clean error
    if (!groq_1.groqProvider.isAvailable) {
        return api_response_1.ApiResponse.error("AI_PROVIDER_UNAVAILABLE", "AI features are not configured. Please add GROQ_API_KEY to your environment variables.", 503);
    }
    const body = await req.json();
    // In AI SDK v7, the client sends { messages: UIMessage[] }
    const messages = body.messages ?? [];
    // Map UIMessage parts to the simple { role, content } format our provider uses
    const mapped = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
        role: m.role,
        content: (m.parts ?? [])
            .filter((p) => p.type === "text")
            .map((p) => p.text ?? "")
            .join(""),
    }));
    return groq_1.groqProvider.streamText({ messages: mapped });
}
