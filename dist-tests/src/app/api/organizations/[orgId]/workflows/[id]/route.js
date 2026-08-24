"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.PATCH = PATCH;
exports.DELETE = DELETE;
const handler_1 = require("@/lib/errors/handler");
const context_1 = require("@/lib/tenant/context");
const workflow_service_1 = require("@/services/workflow.service");
const api_response_1 = require("@/lib/api-response");
// GET /api/organizations/:orgId/workflows/:id
async function GET(_req, { params }) {
    try {
        const { orgId, id } = await params;
        await (0, context_1.requireTenant)(orgId);
        const workflow = await workflow_service_1.workflowService.getById(id, orgId);
        return api_response_1.ApiResponse.success(workflow);
    }
    catch (error) {
        return (0, handler_1.handleApiError)(error);
    }
}
// PATCH /api/organizations/:orgId/workflows/:id
async function PATCH(req, { params }) {
    try {
        const { orgId, id } = await params;
        await (0, context_1.requireRole)(orgId, "workflow:update");
        const body = await req.json();
        const workflow = await workflow_service_1.workflowService.update(id, orgId, body);
        return api_response_1.ApiResponse.success(workflow);
    }
    catch (error) {
        return (0, handler_1.handleApiError)(error);
    }
}
// DELETE /api/organizations/:orgId/workflows/:id
async function DELETE(_req, { params }) {
    try {
        const { orgId, id } = await params;
        await (0, context_1.requireRole)(orgId, "workflow:delete");
        await workflow_service_1.workflowService.delete(id, orgId);
        return api_response_1.ApiResponse.success({ deleted: true });
    }
    catch (error) {
        return (0, handler_1.handleApiError)(error);
    }
}
