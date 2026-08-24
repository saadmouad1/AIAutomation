"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowExecutionService = void 0;
const workflow_execution_repository_1 = require("../repositories/workflow-execution.repository");
const workflow_service_1 = require("./workflow.service");
const permissions_1 = require("../lib/tenant/permissions");
const member_repository_1 = require("../repositories/member.repository");
const execution_engine_1 = require("../lib/automation/engine/execution-engine");
class WorkflowExecutionService {
    /**
     * Starts a new workflow execution.
     *
     * Validations:
     * 1. Checks if the user is a member of the organization.
     * 2. Checks if the user has `workflow:execute` permission.
     * 3. Checks if the workflow exists and belongs to the organization.
     * 4. Validates that the workflow has at least one node to execute.
     *
     * Flow:
     * 1. Generates an immutable snapshot of the workflow definition.
     * 2. Persists the execution record in PENDING state.
     * 3. Starts the ExecutionEngine with the execution ID.
     */
    static async startExecution(organizationId, workflowId, userId, input) {
        // This is maintained for backwards compatibility during refactoring
        // Use TriggerRegistry.getTrigger("MANUAL").execute(...) instead.
        return this.executeManualTrigger(organizationId, workflowId, userId, input);
    }
    /**
     * Internal method for manual trigger execution (with permission checks).
     */
    static async executeManualTrigger(organizationId, workflowId, userId, input) {
        // 1. Verify organization membership & permissions
        const membership = await (0, member_repository_1.getMember)(organizationId, userId);
        if (!membership) {
            throw new Error("FORBIDDEN: User is not a member of the organization.");
        }
        if (!(0, permissions_1.hasPermission)(membership.role, "workflow:execute")) {
            throw new Error("FORBIDDEN: You do not have permission to execute workflows.");
        }
        // 2. Load the workflow & verify ownership
        const workflow = await workflow_service_1.workflowService.getById(workflowId, organizationId);
        if (!workflow) {
            throw new Error("WORKFLOW_NOT_FOUND: Workflow does not exist or access is denied.");
        }
        return this.executeCore(workflow, input);
    }
    /**
     * Internal method for webhook trigger execution (no user context, requires ACTIVE status).
     */
    static async executeWebhookTrigger(organizationId, workflowId, input) {
        const workflow = await workflow_service_1.workflowService.getById(workflowId, organizationId);
        if (!workflow) {
            throw new Error("WORKFLOW_NOT_FOUND: Workflow does not exist.");
        }
        if (workflow.status !== "ACTIVE") {
            throw new Error(`INVALID_STATUS: Webhook execution rejected. Workflow is in ${workflow.status} state.`);
        }
        return this.executeCore(workflow, input);
    }
    /**
     * The core execution logic that creates the snapshot and starts the engine.
     * This assumes all permission and status validations have already been performed by the Trigger.
     */
    static async executeCore(workflow, // using any to avoid importing the exact type if it causes issues, but we can type it better
    input) {
        // 3. Simple structural validation before executing
        if (!workflow.nodes || workflow.nodes.length === 0) {
            throw new Error("INVALID_WORKFLOW: Workflow has no nodes to execute.");
        }
        // 4. Create an immutable snapshot definition
        const definition = {
            nodes: workflow.nodes.map((n) => ({
                ...n,
                data: n.data || {},
            })),
            edges: workflow.edges,
        };
        // 5. Create the execution record
        const execution = await (0, workflow_execution_repository_1.createExecution)(workflow.organizationId, workflow.id, workflow.version, definition, input);
        // 6. Start the execution engine asynchronously
        await execution_engine_1.ExecutionEngine.run(workflow.organizationId, execution.id);
        // 7. Return the refreshed execution state
        const finalExecution = await (0, workflow_execution_repository_1.getExecutionById)(workflow.organizationId, execution.id);
        if (!finalExecution) {
            throw new Error("EXECUTION_NOT_FOUND: Failed to retrieve execution after running.");
        }
        return finalExecution;
    }
    /**
     * Retrieves a specific execution by ID, ensuring tenant isolation.
     */
    static async getExecution(organizationId, executionId, userId) {
        const membership = await (0, member_repository_1.getMember)(organizationId, userId);
        if (!membership) {
            throw new Error("FORBIDDEN: User is not a member of the organization.");
        }
        if (!(0, permissions_1.hasPermission)(membership.role, "workflow:read")) {
            throw new Error("FORBIDDEN: You do not have permission to read workflows.");
        }
        const execution = await (0, workflow_execution_repository_1.getExecutionById)(organizationId, executionId);
        if (!execution) {
            throw new Error("EXECUTION_NOT_FOUND: Execution does not exist.");
        }
        return execution;
    }
    /**
     * Lists executions for an organization.
     */
    static async listExecutions(organizationId, userId, workflowId) {
        const membership = await (0, member_repository_1.getMember)(organizationId, userId);
        if (!membership) {
            throw new Error("FORBIDDEN: User is not a member of the organization.");
        }
        if (!(0, permissions_1.hasPermission)(membership.role, "workflow:read")) {
            throw new Error("FORBIDDEN: You do not have permission to read workflows.");
        }
        return (0, workflow_execution_repository_1.listExecutions)(organizationId, workflowId);
    }
}
exports.WorkflowExecutionService = WorkflowExecutionService;
