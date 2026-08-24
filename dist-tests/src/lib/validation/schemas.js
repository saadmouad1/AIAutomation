"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWorkflowSchema = exports.createWorkflowSchema = exports.workflowEdgeSchema = exports.workflowNodeSchema = exports.updateOrganizationSchema = exports.createOrganizationSchema = exports.paginationSchema = exports.idSchema = void 0;
const zod_1 = require("zod");
exports.idSchema = zod_1.z.string().cuid();
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
});
exports.createOrganizationSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters").max(50),
});
exports.updateOrganizationSchema = exports.createOrganizationSchema.partial();
// ─── Workflow Schemas ─────────────────────────────────────────────────────────
const workflowStatusSchema = zod_1.z.enum(["DRAFT", "ACTIVE", "PAUSED"]);
exports.workflowNodeSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "Node id is required"),
    type: zod_1.z.string().min(1, "Node type is required"),
    position: zod_1.z.object({
        x: zod_1.z.number().finite(),
        y: zod_1.z.number().finite(),
    }),
    data: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).default({}),
});
exports.workflowEdgeSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "Edge id is required"),
    source: zod_1.z.string().min(1, "Edge source is required"),
    target: zod_1.z.string().min(1, "Edge target is required"),
    sourceHandle: zod_1.z.string().nullable().optional(),
    targetHandle: zod_1.z.string().nullable().optional(),
});
exports.createWorkflowSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Workflow name is required").max(100),
    description: zod_1.z.string().max(500).optional(),
    nodes: zod_1.z.array(exports.workflowNodeSchema).default([]),
    edges: zod_1.z.array(exports.workflowEdgeSchema).default([]),
});
exports.updateWorkflowSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    description: zod_1.z.string().max(500).optional(),
    status: workflowStatusSchema.optional(),
    nodes: zod_1.z.array(exports.workflowNodeSchema).optional(),
    edges: zod_1.z.array(exports.workflowEdgeSchema).optional(),
});
