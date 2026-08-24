import { db } from "../lib/db/client";
import { WorkflowExecutionRecord, WorkflowExecutionStatus } from "../types/automations";
import { WorkflowDefinitionSnapshot, NodeExecutionResult } from "../types/execution";
import { Prisma } from "@prisma/client";

/**
 * Creates a new WorkflowExecution record.
 * @param organizationId - The authenticated tenant ID (mandatory)
 * @param workflowId - The workflow being executed
 * @param version - The version of the workflow at the time of execution
 * @param definition - The immutable snapshot of the workflow nodes and edges
 * @param input - Optional JSON input provided to the execution
 */
export async function createExecution(
  organizationId: string,
  workflowId: string,
  version: number,
  definition: WorkflowDefinitionSnapshot,
  input?: Record<string, unknown>
): Promise<WorkflowExecutionRecord> {
  const execution = await db.workflowExecution.create({
    data: {
      organizationId,
      workflowId,
      workflowVersion: version,
      status: "PENDING",
      definition: definition as unknown as Prisma.InputJsonValue,
      input: input ? (input as Prisma.InputJsonValue) : Prisma.JsonNull,
    },
  });

  return mapToRecord(execution);
}

/**
 * Updates an execution's state (status, timestamps, error, nodeResults).
 * Must be tenant scoped.
 */
export async function updateExecutionState(
  organizationId: string,
  executionId: string,
  updates: {
    status?: WorkflowExecutionStatus;
    startedAt?: Date;
    completedAt?: Date;
    error?: string;
    nodeResults?: Record<string, NodeExecutionResult>;
  }
): Promise<WorkflowExecutionRecord> {
  const data: Prisma.WorkflowExecutionUpdateInput = {};

  if (updates.status) data.status = updates.status;
  if (updates.startedAt !== undefined) data.startedAt = updates.startedAt;
  if (updates.completedAt !== undefined) data.completedAt = updates.completedAt;
  if (updates.error !== undefined) data.error = updates.error;
  if (updates.nodeResults !== undefined) {
    data.nodeResults = updates.nodeResults as unknown as Prisma.InputJsonValue;
  }

  const execution = await db.workflowExecution.update({
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
export async function getExecutionById(
  organizationId: string,
  executionId: string
): Promise<WorkflowExecutionRecord | null> {
  const execution = await db.workflowExecution.findFirst({
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
export async function listExecutions(
  organizationId: string,
  workflowId?: string
): Promise<WorkflowExecutionRecord[]> {
  const whereClause: Prisma.WorkflowExecutionWhereInput = {
    organizationId,
  };

  if (workflowId) {
    whereClause.workflowId = workflowId;
  }

  const executions = await db.workflowExecution.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  return executions.map(mapToRecord);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToRecord(execution: any): WorkflowExecutionRecord {
  return {
    ...execution,
    status: execution.status as WorkflowExecutionStatus,
    definition: execution.definition as Record<string, unknown>,
    input: execution.input as Record<string, unknown> | null,
    nodeResults: execution.nodeResults as Record<string, unknown> | null,
  };
}
