import { createExecution, getExecutionById, listExecutions } from "../repositories/workflow-execution.repository";
import { workflowService } from "./workflow.service";
import { hasPermission } from "../lib/tenant/permissions";
import { getMember } from "../repositories/member.repository";
import { WorkflowExecutionRecord } from "../types/automations";
import { WorkflowDefinitionSnapshot } from "../types/execution";
import { ExecutionEngine } from "../lib/automation/engine/execution-engine";

export class WorkflowExecutionService {
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
  static async startExecution(
    organizationId: string,
    workflowId: string,
    userId: string,
    input?: Record<string, unknown>
  ): Promise<WorkflowExecutionRecord> {
    // This is maintained for backwards compatibility during refactoring
    // Use TriggerRegistry.getTrigger("MANUAL").execute(...) instead.
    return this.executeManualTrigger(organizationId, workflowId, userId, input);
  }

  /**
   * Internal method for manual trigger execution (with permission checks).
   */
  static async executeManualTrigger(
    organizationId: string,
    workflowId: string,
    userId: string,
    input?: Record<string, unknown>
  ): Promise<WorkflowExecutionRecord> {
    // 1. Verify organization membership & permissions
    const membership = await getMember(organizationId, userId);
    if (!membership) {
      throw new Error("FORBIDDEN: User is not a member of the organization.");
    }

    if (!hasPermission(membership.role, "workflow:execute")) {
      throw new Error("FORBIDDEN: You do not have permission to execute workflows.");
    }

    // 2. Load the workflow & verify ownership
    const workflow = await workflowService.getById(workflowId, organizationId);
    if (!workflow) {
      throw new Error("WORKFLOW_NOT_FOUND: Workflow does not exist or access is denied.");
    }

    return this.executeCore(workflow, input);
  }

  /**
   * Internal method for webhook trigger execution (no user context, requires ACTIVE status).
   */
  static async executeWebhookTrigger(
    organizationId: string,
    workflowId: string,
    input?: Record<string, unknown>
  ): Promise<WorkflowExecutionRecord> {
    const workflow = await workflowService.getById(workflowId, organizationId);
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
  private static async executeCore(
    workflow: any, // using any to avoid importing the exact type if it causes issues, but we can type it better
    input?: Record<string, unknown>
  ): Promise<WorkflowExecutionRecord> {
    // 3. Simple structural validation before executing
    if (!workflow.nodes || workflow.nodes.length === 0) {
      throw new Error("INVALID_WORKFLOW: Workflow has no nodes to execute.");
    }

    // 4. Create an immutable snapshot definition
    const definition: WorkflowDefinitionSnapshot = {
      nodes: workflow.nodes.map((n: any) => ({
        ...n,
        data: (n.data as Record<string, unknown>) || {},
      })),
      edges: workflow.edges,
    };

    // 5. Create the execution record
    const execution = await createExecution(
      workflow.organizationId,
      workflow.id,
      workflow.version,
      definition,
      input
    );

    // 6. Start the execution engine asynchronously
    await ExecutionEngine.run(workflow.organizationId, execution.id);

    // 7. Return the refreshed execution state
    const finalExecution = await getExecutionById(workflow.organizationId, execution.id);
    if (!finalExecution) {
      throw new Error("EXECUTION_NOT_FOUND: Failed to retrieve execution after running.");
    }

    return finalExecution;
  }

  /**
   * Retrieves a specific execution by ID, ensuring tenant isolation.
   */
  static async getExecution(organizationId: string, executionId: string, userId: string) {
    const membership = await getMember(organizationId, userId);
    if (!membership) {
      throw new Error("FORBIDDEN: User is not a member of the organization.");
    }

    if (!hasPermission(membership.role, "workflow:read")) {
      throw new Error("FORBIDDEN: You do not have permission to read workflows.");
    }

    const execution = await getExecutionById(organizationId, executionId);
    if (!execution) {
      throw new Error("EXECUTION_NOT_FOUND: Execution does not exist.");
    }

    return execution;
  }

  /**
   * Lists executions for an organization.
   */
  static async listExecutions(organizationId: string, userId: string, workflowId?: string) {
    const membership = await getMember(organizationId, userId);
    if (!membership) {
      throw new Error("FORBIDDEN: User is not a member of the organization.");
    }

    if (!hasPermission(membership.role, "workflow:read")) {
      throw new Error("FORBIDDEN: You do not have permission to read workflows.");
    }

    return listExecutions(organizationId, workflowId);
  }
}
