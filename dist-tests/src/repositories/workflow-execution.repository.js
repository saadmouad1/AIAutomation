"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExecution = createExecution;
exports.updateExecutionState = updateExecutionState;
exports.getExecutionById = getExecutionById;
exports.listExecutions = listExecutions;
const client_1 = require("../lib/db/client");
const client_2 = require("@prisma/client");
/**
 * Creates a new WorkflowExecution record.
 * @param organizationId - The authenticated tenant ID (mandatory)
 * @param workflowId - The workflow being executed
 * @param version - The version of the workflow at the time of execution
 * @param definition - The immutable snapshot of the workflow nodes and edges
 * @param input - Optional JSON input provided to the execution
 */
async function createExecution(organizationId, workflowId, version, definition, input) {
    const execution = await client_1.db.workflowExecution.create({
        data: {
            organizationId,
            workflowId,
            workflowVersion: version,
            status: "PENDING",
            definition: definition,
            input: input ? input : client_2.Prisma.JsonNull,
        },
    });
    return mapToRecord(execution);
}
/**
 * Updates an execution's state (status, timestamps, error, nodeResults).
 * Must be tenant scoped.
 */
async function updateExecutionState(organizationId, executionId, updates) {
    const data = {};
    if (updates.status)
        data.status = updates.status;
    if (updates.startedAt !== undefined)
        data.startedAt = updates.startedAt;
    if (updates.completedAt !== undefined)
        data.completedAt = updates.completedAt;
    if (updates.error !== undefined)
        data.error = updates.error;
    if (updates.nodeResults !== undefined) {
        data.nodeResults = updates.nodeResults;
    }
    const execution = await client_1.db.workflowExecution.update({
        where: {
            id: executionId,
            organizationId, // Strict tenant scoping
        },
        data,
    });
    return mapToRecord(execution);
}
/**
 * Retrieves a specific execution by ID, ensuring it belongs to the organization.
 */
async function getExecutionById(organizationId, executionId) {
    const execution = await client_1.db.workflowExecution.findFirst({
        where: {
            id: executionId,
            organizationId,
        },
    });
    return execution ? mapToRecord(execution) : null;
}
/**
 * Lists executions for a given organization, optionally filtered by workflowId.
 */
async function listExecutions(organizationId, workflowId) {
    const whereClause = {
        organizationId,
    };
    if (workflowId) {
        whereClause.workflowId = workflowId;
    }
    const executions = await client_1.db.workflowExecution.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
    });
    return executions.map(mapToRecord);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToRecord(execution) {
    return {
        ...execution,
        status: execution.status,
        definition: execution.definition,
        input: execution.input,
        nodeResults: execution.nodeResults,
    };
}
