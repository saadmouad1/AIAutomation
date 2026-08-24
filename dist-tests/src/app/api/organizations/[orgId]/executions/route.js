"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const workflow_execution_service_1 = require("@/services/workflow-execution.service");
const api_response_1 = require("@/lib/api-response");
const next_1 = require("next-auth/next");
const nextauth_adapter_1 = require("@/lib/auth/nextauth-adapter");
async function GET(req, { params }) {
    try {
        const session = await (0, next_1.getServerSession)(nextauth_adapter_1.authOptions);
        if (!session?.user?.id) {
            return api_response_1.ApiResponse.error("UNAUTHORIZED", "Not authenticated", 401);
        }
        const { orgId } = await params;
        // Parse optional workflowId query param
        const searchParams = req.nextUrl.searchParams;
        const workflowId = searchParams.get("workflowId") || undefined;
        const executions = await workflow_execution_service_1.WorkflowExecutionService.listExecutions(orgId, session.user.id, workflowId);
        return api_response_1.ApiResponse.success(executions);
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.startsWith("FORBIDDEN")) {
                return api_response_1.ApiResponse.error("FORBIDDEN", error.message, 403);
            }
            return api_response_1.ApiResponse.error("BAD_REQUEST", error.message, 400);
        }
        return api_response_1.ApiResponse.error("INTERNAL_SERVER_ERROR", "Internal Server Error", 500);
    }
}
