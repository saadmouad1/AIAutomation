import { z } from "zod";

export const idSchema = z.string().cuid();

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const createOrganizationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

// ─── Workflow Schemas ─────────────────────────────────────────────────────────

const workflowStatusSchema = z.enum(["DRAFT", "ACTIVE", "PAUSED"]);

export const workflowNodeSchema = z.object({
  id: z.string().min(1, "Node id is required"),
  type: z.string().min(1, "Node type is required"),
  position: z.object({
    x: z.number().finite(),
    y: z.number().finite(),
  }),
  data: z.record(z.string(), z.unknown()).default({}),
});

export const workflowEdgeSchema = z.object({
  id: z.string().min(1, "Edge id is required"),
  source: z.string().min(1, "Edge source is required"),
  target: z.string().min(1, "Edge target is required"),
  sourceHandle: z.string().nullable().optional(),
  targetHandle: z.string().nullable().optional(),
});

export const createWorkflowSchema = z.object({
  name: z.string().min(1, "Workflow name is required").max(100),
  description: z.string().max(500).optional(),
  nodes: z.array(workflowNodeSchema).default([]),
  edges: z.array(workflowEdgeSchema).default([]),
});

export const updateWorkflowSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  status: workflowStatusSchema.optional(),
  nodes: z.array(workflowNodeSchema).optional(),
  edges: z.array(workflowEdgeSchema).optional(),
});

export type WorkflowNodeInput = z.infer<typeof workflowNodeSchema>;
export type WorkflowEdgeInput = z.infer<typeof workflowEdgeSchema>;
export type CreateWorkflowInput = z.infer<typeof createWorkflowSchema>;
export type UpdateWorkflowInput = z.infer<typeof updateWorkflowSchema>;

