"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workflowService = void 0;
const workflow_repository_1 = require("../repositories/workflow.repository");
const schemas_1 = require("../lib/validation/schemas");
const app_error_1 = require("../lib/errors/app-error");
// ─── Valid status transitions ─────────────────────────────────────────────────
// DRAFT  → ACTIVE, DRAFT
// ACTIVE → PAUSED, ACTIVE
// PAUSED → ACTIVE, DRAFT, PAUSED
const ALLOWED_TRANSITIONS = {
    DRAFT: ["DRAFT", "ACTIVE"],
    ACTIVE: ["ACTIVE", "PAUSED"],
    PAUSED: ["ACTIVE", "DRAFT", "PAUSED"],
};
class WorkflowService {
    /**
     * Create a new workflow.
     * organizationId and createdById MUST come from the authenticated session — never from the client.
     */
    async create(organizationId, createdById, rawInput) {
        const input = schemas_1.createWorkflowSchema.parse(rawInput);
        return (0, workflow_repository_1.createWorkflow)(organizationId, createdById, input);
    }
    /**
     * Retrieve a workflow by ID, tenant-scoped.
     * Throws 404 if the workflow doesn't exist or belongs to another org (hides existence).
     */
    async getById(id, organizationId) {
        const workflow = await (0, workflow_repository_1.getWorkflowById)(id, organizationId);
        if (!workflow) {
            throw app_error_1.AppError.notFound("Workflow not found");
        }
        return workflow;
    }
    /**
     * List all workflows for the organization.
     */
    async list(organizationId) {
        return (0, workflow_repository_1.listWorkflows)(organizationId);
    }
    /**
     * Update a workflow.
     * Validates input, enforces status transition rules, increments version atomically
     * when the graph definition changes.
     */
    async update(id, organizationId, rawInput) {
        const input = schemas_1.updateWorkflowSchema.parse(rawInput);
        // Validate status transition if a new status is supplied
        if (input.status) {
            const current = await (0, workflow_repository_1.getWorkflowById)(id, organizationId);
            if (!current) {
                throw app_error_1.AppError.notFound("Workflow not found");
            }
            const allowed = ALLOWED_TRANSITIONS[current.status];
            if (!allowed.includes(input.status)) {
                throw app_error_1.AppError.badRequest(`Cannot transition workflow from ${current.status} to ${input.status}`);
            }
        }
        const updated = await (0, workflow_repository_1.updateWorkflow)(id, organizationId, input);
        if (!updated) {
            throw app_error_1.AppError.notFound("Workflow not found");
        }
        return updated;
    }
    /**
     * Delete a workflow, tenant-scoped.
     */
    async delete(id, organizationId) {
        const deleted = await (0, workflow_repository_1.deleteWorkflow)(id, organizationId);
        if (!deleted) {
            throw app_error_1.AppError.notFound("Workflow not found");
        }
        return deleted;
    }
}
exports.workflowService = new WorkflowService();
