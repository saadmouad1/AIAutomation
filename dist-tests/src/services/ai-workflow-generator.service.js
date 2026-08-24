"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiWorkflowGeneratorService = exports.aiWorkflowSchema = void 0;
const zod_1 = require("zod");
const provider_1 = require("../lib/ai/provider");
exports.aiWorkflowSchema = zod_1.z.object({
    nodes: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        type: zod_1.z.string(),
        position: zod_1.z.object({
            x: zod_1.z.number(),
            y: zod_1.z.number(),
        }),
        data: zod_1.z.record(zod_1.z.string(), zod_1.z.any()),
    })),
    edges: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        source: zod_1.z.string(),
        target: zod_1.z.string(),
        sourceHandle: zod_1.z.string().optional(),
        targetHandle: zod_1.z.string().optional(),
    })),
});
class AiWorkflowGeneratorService {
    static async generateWorkflow(prompt) {
        const provider = (0, provider_1.requireProvider)();
        const systemPrompt = `You are an expert automation workflow architect. 
Given a user's natural language request, output a JSON object representing a workflow graph.
The JSON must strictly conform to this schema:
{
  "nodes": [{ "id": "string", "type": "string", "position": { "x": 0, "y": 0 }, "data": {} }],
  "edges": [{ "id": "string", "source": "string", "target": "string" }]
}

Supported Node Types:
- START (no inputs needed)
- END (no inputs needed)
- LOG (data: { message?: string })
- SET_VALUE (data: { key: string, value: any })
- TRANSFORM (data: { operation: "UPPERCASE" | "LOWERCASE" | "TRIM" | "TO_NUMBER", inputKey: string, outputKey: string })
- CONDITION (data: { operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "exists" | "not_exists", inputKey: string, compareValue?: any })
- HTTP_REQUEST (data: { url: string, method: "GET" | "POST" | "PUT" | "DELETE", headers?: object, body?: string })
- AI_GENERATE (data: { prompt: string, systemPrompt?: string })

Constraints:
- Always start with a START node.
- Ensure all edges connect existing nodes.
- Make positions visually logical (e.g., cascading y values).
- ONLY output valid JSON. Do not include markdown formatting like \`\`\`json or explanations. Just the JSON object.`;
        const rawResponse = await provider.generateText({
            messages: [{ role: "user", content: prompt }],
            systemPrompt,
        });
        try {
            // Clean up the response if the model accidentally included markdown
            const cleaned = rawResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            const parsed = JSON.parse(cleaned);
            return exports.aiWorkflowSchema.parse(parsed);
        }
        catch (error) {
            console.error("[AiWorkflowGeneratorService] Failed to parse/validate AI output:", rawResponse, error);
            throw new Error("AI generated an invalid workflow structure. Please try a different prompt.");
        }
    }
}
exports.AiWorkflowGeneratorService = AiWorkflowGeneratorService;
