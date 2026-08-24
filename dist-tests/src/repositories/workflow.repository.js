"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkflow = createWorkflow;
exports.getWorkflowById = getWorkflowById;
exports.getWorkflowByIdUnscoped = getWorkflowByIdUnscoped;
exports.listWorkflows = listWorkflows;
exports.updateWorkflow = updateWorkflow;
exports.deleteWorkflow = deleteWorkflow;
const client_1 = require("../lib/db/client");
// ─── Repository ───────────────────────────────────────────────────────────────
/**
 * Create a new workflow, always scoped to the given organizationId.
 * The createdById must come from the authenticated session — never from the client.
 */
async function createWorkflow(organizationId, createdById, data) {
    return client_1.db.workflow.create({
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
                    data: n.data,
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
async function getWorkflowById(id, organizationId) {
    return client_1.db.workflow.findFirst({
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
async function getWorkflowByIdUnscoped(id) {
    return client_1.db.workflow.findUnique({
        where: { id },
        select: { organizationId: true, status: true },
    });
}
/**
 * List all workflows belonging to the given organization only.
 */
async function listWorkflows(organizationId) {
    return client_1.db.workflow.findMany({
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
async function updateWorkflow(id, organizationId, data) {
    const { nodes, edges, ...scalarUpdates } = data;
    const updateDefinition = nodes !== undefined || edges !== undefined;
    return client_1.db.$transaction(async (tx) => {
        // Verify ownership before mutating
        const existing = await tx.workflow.findFirst({
            where: { id, organizationId },
            select: { id: true },
        });
        if (!existing)
            return null;
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
                            data: n.data,
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
async function deleteWorkflow(id, organizationId) {
    const existing = await client_1.db.workflow.findFirst({
        where: { id, organizationId },
        select: { id: true },
    });
    if (!existing)
        return null;
    return client_1.db.workflow.delete({ where: { id } });
}
