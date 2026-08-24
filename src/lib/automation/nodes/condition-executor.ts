import { NodeExecutor } from "../engine/node-executor";
import { ExecutionContext, NodeExecutionResult } from "../../../types/execution";
import { WorkflowNodeRecord } from "../../../types/automations";

export class ConditionExecutor implements NodeExecutor {
  async execute(node: WorkflowNodeRecord, context: ExecutionContext): Promise<NodeExecutionResult> {
    const startTime = Date.now();
    try {
      const data = node.data as { operator?: string; inputKey?: string; compareValue?: unknown };
      
      if (!data.operator || !data.inputKey) {
        throw new Error("CONDITION node requires 'operator' and 'inputKey'.");
      }

      let inputValue: unknown = context.input[data.inputKey];
      if (inputValue === undefined) {
        for (const res of Object.values(context.nodeResults)) {
          if (res.output && typeof res.output === "object" && data.inputKey in res.output) {
            inputValue = (res.output as Record<string, unknown>)[data.inputKey];
            break;
          }
        }
      }

      let result = false;
      const compareValue = data.compareValue;

      switch (data.operator) {
        case "equals":
          result = inputValue === compareValue;
          break;
        case "not_equals":
          result = inputValue !== compareValue;
          break;
        case "contains":
          if (typeof inputValue === "string" && typeof compareValue === "string") {
            result = inputValue.includes(compareValue);
          } else if (Array.isArray(inputValue)) {
            result = inputValue.includes(compareValue);
          }
          break;
        case "not_contains":
          if (typeof inputValue === "string" && typeof compareValue === "string") {
            result = !inputValue.includes(compareValue);
          } else if (Array.isArray(inputValue)) {
            result = !inputValue.includes(compareValue);
          }
          break;
        case "greater_than":
          if (typeof inputValue === "number" && typeof compareValue === "number") {
            result = inputValue > compareValue;
          }
          break;
        case "less_than":
          if (typeof inputValue === "number" && typeof compareValue === "number") {
            result = inputValue < compareValue;
          }
          break;
        case "exists":
          result = inputValue !== undefined && inputValue !== null;
          break;
        case "not_exists":
          result = inputValue === undefined || inputValue === null;
          break;
        default:
          throw new Error(`Unsupported condition operator: ${data.operator}`);
      }

      return {
        success: true,
        output: { result },
        durationMs: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "CONDITION_ERROR",
          message: error instanceof Error ? error.message : "Unknown error in CONDITION",
        },
        durationMs: Date.now() - startTime,
      };
    }
  }
}
