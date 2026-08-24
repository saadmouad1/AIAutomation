import { ExecutionContext, NodeExecutionResult } from "../../../types/execution";
import { WorkflowNodeRecord } from "../../../types/automations";
import { SetValueExecutor } from "../nodes/set-value-executor";
import { TransformExecutor } from "../nodes/transform-executor";
import { ConditionExecutor } from "../nodes/condition-executor";
import { HttpRequestExecutor } from "../nodes/http-request-executor";
import { AiGenerateExecutor } from "../nodes/ai-generate-executor";
import { SendMessageExecutor } from "../nodes/send-message-executor";

/**
 * Base interface for all node executors.
 */
export interface NodeExecutor {
  execute(node: WorkflowNodeRecord, context: ExecutionContext): Promise<NodeExecutionResult>;
}

/**
 * START Node Executor
 * Simply passes input forward and initializes execution.
 */
class StartNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNodeRecord, context: ExecutionContext): Promise<NodeExecutionResult> {
    const startTime = Date.now();
    return {
      success: true,
      output: context.input,
      durationMs: Date.now() - startTime,
    };
  }
}

/**
 * LOG Node Executor
 * Simulates an action by logging input and succeeding.
 */
class LogNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNodeRecord, context: ExecutionContext): Promise<NodeExecutionResult> {
    const startTime = Date.now();
    
    // In a real implementation, we would evaluate input mapping expressions here
    // For now, we just pass the raw node data and context input
    const logData = {
      nodeData: node.data,
      contextInput: context.input,
    };

    console.log(`[LOG NODE ${node.nodeId}]`, JSON.stringify(logData));

    return {
      success: true,
      output: { logged: true, data: logData },
      durationMs: Date.now() - startTime,
    };
  }
}

/**
 * END Node Executor
 * Terminates execution successfully.
 */
class EndNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNodeRecord, context: ExecutionContext): Promise<NodeExecutionResult> {
    const startTime = Date.now();
    return {
      success: true,
      output: { completed: true },
      durationMs: Date.now() - startTime,
    };
  }
}

/**
 * Node Executor Registry
 * Routes node execution to the appropriate executor based on node type.
 */
export class NodeExecutorRegistry {
  private static executors: Record<string, NodeExecutor> = {
    START: new StartNodeExecutor(),
    LOG: new LogNodeExecutor(),
    END: new EndNodeExecutor(),
    SET_VALUE: new SetValueExecutor(),
    TRANSFORM: new TransformExecutor(),
    CONDITION: new ConditionExecutor(),
    HTTP_REQUEST: new HttpRequestExecutor(),
    AI_GENERATE: new AiGenerateExecutor(),
    SEND_MESSAGE: new SendMessageExecutor(),
    // Lowercase variants to match React Flow components if needed
    start: new StartNodeExecutor(),
    log: new LogNodeExecutor(),
    end: new EndNodeExecutor(),
    set_value: new SetValueExecutor(),
    transform: new TransformExecutor(),
    condition: new ConditionExecutor(),
    http_request: new HttpRequestExecutor(),
    ai_generate: new AiGenerateExecutor(),
    send_message: new SendMessageExecutor(),
    // We can also alias "trigger" to START and "action" to LOG for MVP if needed
    trigger: new StartNodeExecutor(),
    action: new LogNodeExecutor(),
  };

  static async executeNode(
    node: WorkflowNodeRecord,
    context: ExecutionContext
  ): Promise<NodeExecutionResult> {
    const executor = this.executors[node.type];
    
    if (!executor) {
      return {
        success: false,
        error: {
          code: "UNKNOWN_NODE_TYPE",
          message: `No executor found for node type: ${node.type}`,
        },
      };
    }

    try {
      return await executor.execute(node, context);
    } catch (error) {
      return {
        success: false,
        error: {
          code: "NODE_EXECUTION_FAILED",
          message: error instanceof Error ? error.message : "Unknown node execution error",
        },
      };
    }
  }
}
