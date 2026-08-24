"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiGenerateExecutor = void 0;
const provider_1 = require("../../../lib/ai/provider");
class AiGenerateExecutor {
    async execute(node, context) {
        const startTime = Date.now();
        try {
            const data = node.data;
            if (!data.prompt) {
                throw new Error("AI_GENERATE node requires a 'prompt' in configuration.");
            }
            // Replaces variables in the prompt. Very rudimentary replacement logic for MVP.
            let prompt = data.prompt;
            // Simple variable interpolation e.g., {{input.email}}
            const regex = /\{\{([\w.]+)\}\}/g;
            prompt = prompt.replace(regex, (match, path) => {
                const value = this.getValueFromContext(path, context);
                return value !== undefined ? String(value) : match;
            });
            const provider = (0, provider_1.requireProvider)();
            const generatedText = await provider.generateText({
                messages: [{ role: "user", content: prompt }],
                systemPrompt: data.systemPrompt || "You are an AI assistant in an automated workflow.",
            });
            return {
                success: true,
                output: { generatedText },
                durationMs: Date.now() - startTime,
            };
        }
        catch (error) {
            return {
                success: false,
                error: {
                    code: "AI_GENERATE_ERROR",
                    message: error instanceof Error ? error.message : "Unknown error in AI_GENERATE",
                },
                durationMs: Date.now() - startTime,
            };
        }
    }
    getValueFromContext(path, context) {
        const parts = path.split(".");
        // Check in input first
        if (parts[0] === "input") {
            let current = context.input;
            for (let i = 1; i < parts.length; i++) {
                if (current === undefined || current === null)
                    return undefined;
                current = current[parts[i]];
            }
            return current;
        }
        // Check in nodeResults
        if (parts.length > 1) {
            const nodeId = parts[0];
            const result = context.nodeResults[nodeId];
            if (result && result.output) {
                let current = result.output;
                for (let i = 1; i < parts.length; i++) {
                    if (current === undefined || current === null)
                        return undefined;
                    current = current[parts[i]];
                }
                return current;
            }
        }
        return undefined;
    }
}
exports.AiGenerateExecutor = AiGenerateExecutor;
