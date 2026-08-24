import { NodeExecutor } from "../engine/node-executor";
import { ExecutionContext, NodeExecutionResult } from "../../../types/execution";
import { WorkflowNodeRecord } from "../../../types/automations";

export class SetValueExecutor implements NodeExecutor {
  async execute(node: WorkflowNodeRecord, context: ExecutionContext): Promise<NodeExecutionResult> {
    const startTime = Date.now();
    try {
      const data = node.data as { key?: string; value?: unknown };
      
      if (!data.key) {
        throw new Error("SET_VALUE node requires a 'key' in configuration.");
      }

      // We store the new value in the execution context output
      return {
        success: true,
        output: { [data.key]: data.value },
        durationMs: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "SET_VALUE_ERROR",
          message: error instanceof Error ? error.message : "Unknown error in SET_VALUE",
        },
        durationMs: Date.now() - startTime,
      };
    }
  }
}
