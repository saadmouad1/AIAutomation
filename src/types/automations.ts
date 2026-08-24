// ─── Legacy types (used by remaining mock UI until fully replaced) ─────────────
export type AutomationStatus = "active" | "paused" | "draft" | "error";
export type TriggerType = "form_submitted" | "contact_created" | "lead_status_changed" | "schedule" | "webhook" | "manual";
export type ActionType = "send_email" | "create_lead" | "create_task" | "send_notification" | "update_field" | "http_request";

export interface WorkflowStep {
  id: string;
  type: "trigger" | "action" | "condition";
  name: string;
  description: string;
  icon?: string;
  config?: Record<string, unknown>;
}

export interface Automation {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  status: AutomationStatus;
  runCount: number;
  lastRunAt?: Date | null;
  steps: WorkflowStep[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── DB-aligned Workflow types ────────────────────────────────────────────────

/** Matches the Prisma WorkflowStatus enum */
export type WorkflowStatus = "DRAFT" | "ACTIVE" | "PAUSED";

/** Matches the Prisma WorkflowExecutionStatus enum */
export type WorkflowExecutionStatus = "PENDING" | "RUNNING" | "SUCCESS" | "FAILED" | "CANCELLED";

/** A persisted workflow node — matches React Flow node shape */
export interface WorkflowNodeRecord {
  id: string;        // Prisma row id
  workflowId: string;
  nodeId: string;    // React Flow node id
  type: string;
  positionX: number;
  positionY: number;
  data: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/** A persisted workflow edge — matches React Flow edge shape */
export interface WorkflowEdgeRecord {
  id: string;        // Prisma row id
  workflowId: string;
  edgeId: string;    // React Flow edge id
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Full workflow record from the database */
export interface WorkflowRecord {
  id: string;
  organizationId: string;
  createdById: string;
  name: string;
  description: string | null;
  status: WorkflowStatus;
  version: number;
  nodes: WorkflowNodeRecord[];
  edges: WorkflowEdgeRecord[];
  createdAt: Date;
  updatedAt: Date;
}

/** Workflow list item (no nodes/edges, includes counts) */
export interface WorkflowListItem {
  id: string;
  organizationId: string;
  createdById: string;
  name: string;
  description: string | null;
  status: WorkflowStatus;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  _count: { nodes: number; edges: number };
}

/** Full workflow execution record from the database */
export interface WorkflowExecutionRecord {
  id: string;
  workflowId: string;
  organizationId: string;
  workflowVersion: number;
  status: WorkflowExecutionStatus;
  definition: Record<string, unknown>; // Snapshot of nodes and edges
  input: Record<string, unknown> | null;
  nodeResults: Record<string, unknown> | null;
  error: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}


