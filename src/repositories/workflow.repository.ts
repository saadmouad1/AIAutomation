import { db } from "../lib/db/client";
import type { WorkflowStatus } from "@prisma/client";
import type { WorkflowNodeInput, WorkflowEdgeInput } from "../lib/validation/schemas";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CreateWorkflowData {
  name: string;
  description?: string;
  nodes: WorkflowNodeInput[];
  edges: WorkflowEdgeInput[];
}

export interface UpdateWorkflowData {
  name?: string;
  description?: string;
  status?: WorkflowStatus;
  nodes?: WorkflowNodeInput[];
  edges?: WorkflowEdgeInput[];
}

// ─── Repository ───────────────────────────────────────────────────────────────

/**
 * Create a new workflow, always scoped to the given organizationId.
 * The createdById must come from the authenticated session — never from the client.
 */
export async function createWorkflow(
  organizationId: string,
  createdById: string,
  data: CreateWorkflowData
) {
  return db.workflow.create({
    data: {
      organizationId,
      createdById,
      name: data.name,
      description: data.description,
      status: "DRAFT",
      version: 1,
      nodes: {
        create: data.nodes.map((n) => ({
          nodeId: n.id,
          type: n.type,
          positionX: n.position.x,
          positionY: n.position.y,
          data: n.data as object,
        })),
      },
      edges: {
        create: data.edges.map((e) => ({
          edgeId: e.id,
          source: e.source,
          target: e.target,
          sourceHandle: e.sourceHandle ?? null,
          targetHandle: e.targetHandle ?? null,
        })),
      },
    },
    include: {
      nodes: true,
      edges: true,
    },
  });
}

/**
 * Retrieve a workflow by ID, strictly scoped to organizationId.
 * Returns null if the workflow does not exist OR belongs to a different org.
 */
export async function getWorkflowById(id: string, organizationId: string) {
  return db.workflow.findFirst({
    where: { id, organizationId },
    include: {
      nodes: { orderBy: { createdAt: "asc" } },
      edges: { orderBy: { createdAt: "asc" } },
    },
  });
}

/**
 * Retrieve a workflow by ID without scoping to organizationId.
 * For use by webhooks where organizationId is not yet known.
 */
export async function getWorkflowByIdUnscoped(id: string) {
  return db.workflow.findUnique({
    where: { id },
    select: { organizationId: true, status: true },
  });
}

/**
 * List all workflows belonging to the given organization only.
 */
export async function listWorkflows(organizationId: string) {
  return db.workflow.findMany({
    where: { organizationId },
    include: {
      nodes: false,
      edges: false,
      _count: { select: { nodes: true, edges: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

/**
 * Update a workflow, always scoped to organizationId.
 * Increments version atomically as part of the same DB operation.
 * When nodes or edges are included, replaces the entire graph transactionally.
 */
export async function updateWorkflow(
  id: string,
  organizationId: string,
  data: UpdateWorkflowData
) {
  const { nodes, edges, ...scalarUpdates } = data;

  const updateDefinition = nodes !== undefined || edges !== undefined;

  return db.$transaction(async (tx) => {
    // Verify ownership before mutating
    const existing = await tx.workflow.findFirst({
      where: { id, organizationId },
      select: { id: true },
    });
    if (!existing) return null;

    if (updateDefinition) {
      // Delete and re-create nodes/edges atomically
      if (nodes !== undefined) {
        await tx.workflowNode.deleteMany({ where: { workflowId: id } });
        if (nodes.length > 0) {
          await tx.workflowNode.createMany({
            data: nodes.map((n) => ({
              workflowId: id,
              nodeId: n.id,
              type: n.type,
              positionX: n.position.x,
              positionY: n.position.y,
              data: n.data as object,
            })),
          });
        }
      }

      if (edges !== undefined) {
        await tx.workflowEdge.deleteMany({ where: { workflowId: id } });
        if (edges.length > 0) {
          await tx.workflowEdge.createMany({
            data: edges.map((e) => ({
              workflowId: id,
              edgeId: e.id,
              source: e.source,
              target: e.target,
              sourceHandle: e.sourceHandle ?? null,
              targetHandle: e.targetHandle ?? null,
            })),
          });
        }
      }
    }

    // Atomic version increment using Prisma's increment operation
    return await tx.workflow.update({
      where: { id },
      data: {
        ...(scalarUpdates.name !== undefined && { name: scalarUpdates.name }),
        ...(scalarUpdates.description !== undefined && { description: scalarUpdates.description }),
        ...(scalarUpdates.status !== undefined && { status: scalarUpdates.status }),
        // Only increment version when the definition (graph) changes
        ...(updateDefinition && { version: { increment: 1 } }),
      },
      include: {
        nodes: { orderBy: { createdAt: "asc" } },
        edges: { orderBy: { createdAt: "asc" } },
      },
    });
  }, { maxWait: 15000, timeout: 30000 });
}

/**
 * Delete a workflow, strictly scoped to organizationId.
 * Returns null if not found or belongs to different org.
 */
export async function deleteWorkflow(id: string, organizationId: string) {
  const existing = await db.workflow.findFirst({
    where: { id, organizationId },
    select: { id: true },
  });
  if (!existing) return null;

  return db.workflow.delete({ where: { id } });
}
