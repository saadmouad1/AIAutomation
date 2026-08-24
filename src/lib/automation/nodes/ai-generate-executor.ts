import { NodeExecutor } from "../engine/node-executor";
import { ExecutionContext, NodeExecutionResult } from "../../../types/execution";
import { WorkflowNodeRecord } from "../../../types/automations";
import { requireProvider } from "../../../lib/ai/provider";

export class AiGenerateExecutor implements NodeExecutor {
  async execute(node: WorkflowNodeRecord, context: ExecutionContext): Promise<NodeExecutionResult> {
    const startTime = Date.now();
    try {
      const data = node.data as { prompt?: string; systemPrompt?: string };
      
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

      const provider = requireProvider();

      const generatedText = await provider.generateText({
        messages: [{ role: "user", content: prompt }],
        systemPrompt: data.systemPrompt || "You are an AI assistant in an automated workflow.",
      });

      return {
        success: true,
        output: { generatedText },
        durationMs: Date.now() - startTime,
      };
    } catch (error) {
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

  private getValueFromContext(path: string, context: ExecutionContext): unknown {
    const parts = path.split(".");
    
    // Check in input first
    if (parts[0] === "input") {
      let current: any = context.input;
      for (let i = 1; i < parts.length; i++) {
        if (current === undefined || current === null) return undefined;
        current = current[parts[i]];
      }
      return current;
    }

    // Check in nodeResults
    if (parts.length > 1) {
      const nodeId = parts[0];
      const result = context.nodeResults[nodeId];
      if (result && result.output) {
        let current: any = result.output;
        for (let i = 1; i < parts.length; i++) {
          if (current === undefined || current === null) return undefined;
          current = current[parts[i]];
        }
        return current;
      }
    }

    return undefined;
  }
}
