"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionEngine = void 0;
const workflow_execution_repository_1 = require("../../../repositories/workflow-execution.repository");
const node_executor_1 = require("./node-executor");
const MAX_STEPS = 50;
class ExecutionEngine {
    /**
     * Main entry point to run a workflow execution.
     */
    static async run(organizationId, executionId) {
        // 1. Load Execution Snapshot
        const execution = await (0, workflow_execution_repository_1.getExecutionById)(organizationId, executionId);
        if (!execution) {
            console.error(`[ExecutionEngine] Execution ${executionId} not found.`);
            return;
        }
        if (execution.status !== "PENDING") {
            console.warn(`[ExecutionEngine] Execution ${executionId} is already in state ${execution.status}`);
            return;
        }
        // Mark as running
        await (0, workflow_execution_repository_1.updateExecutionState)(organizationId, executionId, {
            status: "RUNNING",
            startedAt: new Date(),
        });
        try {
            const definition = execution.definition;
            if (!definition.nodes || definition.nodes.length === 0) {
                throw new Error("INVALID_WORKFLOW: Workflow has no nodes to execute.");
            }
            // Initialize Execution Context
            const context = {
                executionId: execution.id,
                workflowId: execution.workflowId,
                organizationId: execution.organizationId,
                workflowVersion: execution.workflowVersion,
                input: execution.input || {},
                nodeResults: {},
            };
            // 2. Find Starting Node
            // For MVP, look for a node of type START or trigger, or a node with no incoming edges
            const startNode = this.findStartNode(definition);
            if (!startNode) {
                throw new Error("INVALID_WORKFLOW: Could not determine starting node.");
            }
            // 3. Traverse and Execute
            let currentNode = startNode;
            let stepsTaken = 0;
            const visitedNodes = new Set();
            while (currentNode) {
                // Enforce MAX_STEPS
                if (stepsTaken >= MAX_STEPS) {
                    throw new Error("MAX_STEPS_EXCEEDED: Execution exceeded maximum allowed steps.");
                }
                // Cycle Protection
                if (visitedNodes.has(currentNode.nodeId)) {
                    throw new Error("CYCLE_DETECTED: Infinite loop detected during execution.");
                }
                visitedNodes.add(currentNode.nodeId);
                stepsTaken++;
                // 4. Execute Node with Minimal Retry Policy
                let result;
                let retries = 0;
                const MAX_RETRIES = 2;
                while (true) {
                    result = await node_executor_1.NodeExecutorRegistry.executeNode(currentNode, context);
                    if (!result.success && result.error?.code === "HTTP_REQUEST_ERROR") {
                        const isRetryable = result.error.message.includes("timed out") ||
                            result.error.message.includes("502") ||
                            result.error.message.includes("503") ||
                            result.error.message.includes("504");
                        if (isRetryable && retries < MAX_RETRIES) {
                            retries++;
                            await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Exponential backoff
                            continue;
                        }
                    }
                    break; // Exit retry loop
                }
                // 5. Store Node Result
                context.nodeResults[currentNode.nodeId] = result;
                if (!result.success) {
                    // Node failed, halt execution
                    throw new Error(`NODE_EXECUTION_FAILED: ${result.error?.message || "Unknown error"}`);
                }
                // Check if this was an END node
                if (currentNode.type.toUpperCase() === "END") {
                    break; // Successfully finished
                }
                // 6. Find Next Node
                currentNode = this.findNextNode(currentNode.nodeId, definition, result);
            }
            // 7. Execution Complete (Success)
            await (0, workflow_execution_repository_1.updateExecutionState)(organizationId, executionId, {
                status: "SUCCESS",
                completedAt: new Date(),
                nodeResults: context.nodeResults,
            });
        }
        catch (error) {
            // 8. Execution Failed
            const errorMessage = error instanceof Error ? error.message : "Unknown execution error";
            await (0, workflow_execution_repository_1.updateExecutionState)(organizationId, executionId, {
                status: "FAILED",
                completedAt: new Date(),
                error: errorMessage,
            });
        }
    }
    static findStartNode(definition) {
        // Priority 1: Explicit START or trigger type
        const explicitStart = definition.nodes.find(n => n.type.toUpperCase() === "START" || n.type.toLowerCase() === "trigger");
        if (explicitStart)
            return explicitStart;
        // Priority 2: Node with no incoming edges
        const targetIds = new Set(definition.edges.map(e => e.target));
        const orphanNode = definition.nodes.find(n => !targetIds.has(n.nodeId));
        return orphanNode;
    }
    static findNextNode(currentNodeId, definition, nodeResult) {
        // Find edges where source is currentNode
        const outgoingEdges = definition.edges.filter(e => e.source === currentNodeId);
        if (outgoingEdges.length === 0)
            return undefined;
        let selectedEdge = outgoingEdges[0];
        // Handle branching for CONDITION nodes
        if (outgoingEdges.length > 1 && nodeResult?.output && typeof nodeResult.output.result === "boolean") {
            const handleName = nodeResult.output.result ? "true" : "false";
            const branchEdge = outgoingEdges.find(e => e.sourceHandle === handleName);
            if (branchEdge) {
                selectedEdge = branchEdge;
            }
        }
        // Find the target node
        return definition.nodes.find(n => n.nodeId === selectedEdge.target);
    }
}
exports.ExecutionEngine = ExecutionEngine;
