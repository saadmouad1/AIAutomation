"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeExecutorRegistry = void 0;
const set_value_executor_1 = require("../nodes/set-value-executor");
const transform_executor_1 = require("../nodes/transform-executor");
const condition_executor_1 = require("../nodes/condition-executor");
const http_request_executor_1 = require("../nodes/http-request-executor");
const ai_generate_executor_1 = require("../nodes/ai-generate-executor");
const send_message_executor_1 = require("../nodes/send-message-executor");
/**
 * START Node Executor
 * Simply passes input forward and initializes execution.
 */
class StartNodeExecutor {
    async execute(node, context) {
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
class LogNodeExecutor {
    async execute(node, context) {
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
class EndNodeExecutor {
    async execute(node, context) {
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
class NodeExecutorRegistry {
    static executors = {
        START: new StartNodeExecutor(),
        LOG: new LogNodeExecutor(),
        END: new EndNodeExecutor(),
        SET_VALUE: new set_value_executor_1.SetValueExecutor(),
        TRANSFORM: new transform_executor_1.TransformExecutor(),
        CONDITION: new condition_executor_1.ConditionExecutor(),
        HTTP_REQUEST: new http_request_executor_1.HttpRequestExecutor(),
        AI_GENERATE: new ai_generate_executor_1.AiGenerateExecutor(),
        SEND_MESSAGE: new send_message_executor_1.SendMessageExecutor(),
        // Lowercase variants to match React Flow components if needed
        start: new StartNodeExecutor(),
        log: new LogNodeExecutor(),
        end: new EndNodeExecutor(),
        set_value: new set_value_executor_1.SetValueExecutor(),
        transform: new transform_executor_1.TransformExecutor(),
        condition: new condition_executor_1.ConditionExecutor(),
        http_request: new http_request_executor_1.HttpRequestExecutor(),
        ai_generate: new ai_generate_executor_1.AiGenerateExecutor(),
        send_message: new send_message_executor_1.SendMessageExecutor(),
        // We can also alias "trigger" to START and "action" to LOG for MVP if needed
        trigger: new StartNodeExecutor(),
        action: new LogNodeExecutor(),
    };
    static async executeNode(node, context) {
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
        }
        catch (error) {
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
exports.NodeExecutorRegistry = NodeExecutorRegistry;
