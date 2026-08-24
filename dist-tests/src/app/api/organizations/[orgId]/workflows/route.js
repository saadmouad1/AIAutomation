"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const handler_1 = require("@/lib/errors/handler");
const context_1 = require("@/lib/tenant/context");
const auth_1 = require("@/lib/auth");
const workflow_service_1 = require("@/services/workflow.service");
const api_response_1 = require("@/lib/api-response");
// GET /api/organizations/:orgId/workflows — list all workflows in the org
async function GET(_req, { params }) {
    try {
        const { orgId } = await params;
        // Any member can read workflows
        await (0, context_1.requireTenant)(orgId);
        const workflows = await workflow_service_1.workflowService.list(orgId);
        return api_response_1.ApiResponse.success(workflows);
    }
    catch (error) {
        return (0, handler_1.handleApiError)(error);
    }
}
// POST /api/organizations/:orgId/workflows — create a new workflow
async function POST(req, { params }) {
    try {
        const { orgId } = await params;
        // Must have create permission
        await (0, context_1.requireRole)(orgId, "workflow:create");
        // Get the authenticated user — createdById NEVER comes from the client
        const user = await (0, auth_1.requireUser)();
        const body = await req.json();
        const workflow = await workflow_service_1.workflowService.create(orgId, user.id, body);
        return api_response_1.ApiResponse.success(workflow, 201);
    }
    catch (error) {
        return (0, handler_1.handleApiError)(error);
    }
}
