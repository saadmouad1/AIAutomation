import {
  createWorkflow,
  getWorkflowById,
  listWorkflows,
  updateWorkflow,
  deleteWorkflow,
} from "../repositories/workflow.repository";
import {
  createWorkflowSchema,
  updateWorkflowSchema,
  type CreateWorkflowInput,
  type UpdateWorkflowInput,
} from "../lib/validation/schemas";
import { AppError } from "../lib/errors/app-error";
import type { WorkflowStatus } from "@prisma/client";

// ─── Valid status transitions ─────────────────────────────────────────────────
// DRAFT  → ACTIVE, DRAFT
// ACTIVE → PAUSED, ACTIVE
// PAUSED → ACTIVE, DRAFT, PAUSED

const ALLOWED_TRANSITIONS: Record<WorkflowStatus, WorkflowStatus[]> = {
  DRAFT: ["DRAFT", "ACTIVE"],
  ACTIVE: ["ACTIVE", "PAUSED"],
  PAUSED: ["ACTIVE", "DRAFT", "PAUSED"],
};

class WorkflowService {
  /**
   * Create a new workflow.
   * organizationId and createdById MUST come from the authenticated session — never from the client.
   */
  async create(
    organizationId: string,
    createdById: string,
    rawInput: unknown
  ) {
    const input: CreateWorkflowInput = createWorkflowSchema.parse(rawInput);
    return createWorkflow(organizationId, createdById, input);
  }

  /**
   * Retrieve a workflow by ID, tenant-scoped.
   * Throws 404 if the workflow doesn't exist or belongs to another org (hides existence).
   */
  async getById(id: string, organizationId: string) {
    const workflow = await getWorkflowById(id, organizationId);
    if (!workflow) {
      throw AppError.notFound("Workflow not found");
    }
    return workflow;
  }

  /**
   * List all workflows for the organization.
   */
  async list(organizationId: string) {
    return listWorkflows(organizationId);
  }

  /**
   * Update a workflow.
   * Validates input, enforces status transition rules, increments version atomically
   * when the graph definition changes.
   */
  async update(
    id: string,
    organizationId: string,
    rawInput: unknown
  ) {
    const input: UpdateWorkflowInput = updateWorkflowSchema.parse(rawInput);

    // Validate status transition if a new status is supplied
    if (input.status) {
      const current = await getWorkflowById(id, organizationId);
      if (!current) {
        throw AppError.notFound("Workflow not found");
      }

      const allowed = ALLOWED_TRANSITIONS[current.status];
      if (!allowed.includes(input.status)) {
        throw AppError.badRequest(
          `Cannot transition workflow from ${current.status} to ${input.status}`
        );
      }
    }

    const updated = await updateWorkflow(id, organizationId, input);
    if (!updated) {
      throw AppError.notFound("Workflow not found");
    }
    return updated;
  }

  /**
   * Delete a workflow, tenant-scoped.
   */
  async delete(id: string, organizationId: string) {
    const deleted = await deleteWorkflow(id, organizationId);
    if (!deleted) {
      throw AppError.notFound("Workflow not found");
    }
    return deleted;
  }
}

export const workflowService = new WorkflowService();
