import { z } from "zod";
import { requireProvider } from "../lib/ai/provider";

export const aiWorkflowSchema = z.object({
  nodes: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      position: z.object({
        x: z.number(),
        y: z.number(),
      }),
      data: z.record(z.string(), z.any()),
    })
  ),
  edges: z.array(
    z.object({
      id: z.string(),
      source: z.string(),
      target: z.string(),
      sourceHandle: z.string().optional(),
      targetHandle: z.string().optional(),
    })
  ),
});

export type GeneratedWorkflow = z.infer<typeof aiWorkflowSchema>;

export class AiWorkflowGeneratorService {
  static async generateWorkflow(prompt: string): Promise<GeneratedWorkflow> {
    const provider = requireProvider();

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
      return aiWorkflowSchema.parse(parsed);
    } catch (error) {
      console.error("[AiWorkflowGeneratorService] Failed to parse/validate AI output:", rawResponse, error);
      throw new Error("AI generated an invalid workflow structure. Please try a different prompt.");
    }
  }
}
