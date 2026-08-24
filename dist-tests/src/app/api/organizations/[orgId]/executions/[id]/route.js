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
        const { orgId, id: executionId } = await params;
        const execution = await workflow_execution_service_1.WorkflowExecutionService.getExecution(orgId, executionId, session.user.id);
        return api_response_1.ApiResponse.success(execution);
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.startsWith("FORBIDDEN")) {
                return api_response_1.ApiResponse.error("FORBIDDEN", error.message, 403);
            }
            if (error.message.startsWith("EXECUTION_NOT_FOUND")) {
                return api_response_1.ApiResponse.error("NOT_FOUND", error.message, 404);
            }
            return api_response_1.ApiResponse.error("BAD_REQUEST", error.message, 400);
        }
        return api_response_1.ApiResponse.error("INTERNAL_SERVER_ERROR", "Internal Server Error", 500);
    }
}
