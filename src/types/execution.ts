import { WorkflowNodeRecord, WorkflowEdgeRecord, WorkflowExecutionStatus } from "./automations";

/**
 * The runtime context passed to every node during execution.
 * It contains the initial input, results from previously executed nodes,
 * and immutable references to the execution environment.
 */
export interface ExecutionContext {
  executionId: string;
  workflowId: string;
  organizationId: string;
  workflowVersion: number;
  input: Record<string, unknown>;
  nodeResults: Record<string, NodeExecutionResult>;
}

/**
 * Standardized result structure returned by every node executor.
 */
export interface NodeExecutionResult {
  success: boolean;
  output?: Record<string, unknown>;
  error?: ExecutionError;
  durationMs?: number;
}

/**
 * Structured error format for execution and node failures.
 */
export interface ExecutionError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Represents the immutable snapshot of a workflow used during execution.
 */
export interface WorkflowDefinitionSnapshot {
  nodes: WorkflowNodeRecord[];
  edges: WorkflowEdgeRecord[];
}
