import { NodeExecutor } from "../engine/node-executor";
import { ExecutionContext, NodeExecutionResult } from "../../../types/execution";
import { WorkflowNodeRecord } from "../../../types/automations";

export class TransformExecutor implements NodeExecutor {
  async execute(node: WorkflowNodeRecord, context: ExecutionContext): Promise<NodeExecutionResult> {
    const startTime = Date.now();
    try {
      const data = node.data as { operation?: string; inputKey?: string; outputKey?: string };
      
      if (!data.operation || !data.inputKey || !data.outputKey) {
        throw new Error("TRANSFORM node requires 'operation', 'inputKey', and 'outputKey'.");
      }

      // We resolve the input value from context.input (or previous nodeResults in a real evaluation context)
      // For MVP, we just assume context.input contains it, or we look it up from nodeResults.
      // A proper expression evaluator would be better, but we'll use a simple lookup for MVP.
      let inputValue: unknown = context.input[data.inputKey];
      if (inputValue === undefined) {
        // Fallback to searching nodeResults output if it was outputted by a previous node
        for (const res of Object.values(context.nodeResults)) {
          if (res.output && typeof res.output === "object" && data.inputKey in res.output) {
            inputValue = (res.output as Record<string, unknown>)[data.inputKey];
            break;
          }
        }
      }

      let transformedValue: unknown = inputValue;

      switch (data.operation) {
        case "UPPERCASE":
          if (typeof inputValue === "string") transformedValue = inputValue.toUpperCase();
          break;
        case "LOWERCASE":
          if (typeof inputValue === "string") transformedValue = inputValue.toLowerCase();
          break;
        case "TRIM":
          if (typeof inputValue === "string") transformedValue = inputValue.trim();
          break;
        case "TO_NUMBER":
          if (typeof inputValue === "string" || typeof inputValue === "number") {
            const num = Number(inputValue);
            transformedValue = isNaN(num) ? null : num;
          }
          break;
        default:
          throw new Error(`Unsupported transform operation: ${data.operation}`);
      }

      return {
        success: true,
        output: { [data.outputKey]: transformedValue },
        durationMs: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "TRANSFORM_ERROR",
          message: error instanceof Error ? error.message : "Unknown error in TRANSFORM",
        },
        durationMs: Date.now() - startTime,
      };
    }
  }
}
