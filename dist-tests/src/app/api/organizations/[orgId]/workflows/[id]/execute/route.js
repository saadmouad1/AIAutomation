"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const trigger_registry_1 = require("@/lib/automation/triggers/trigger-registry");
const api_response_1 = require("@/lib/api-response");
const next_1 = require("next-auth/next");
const nextauth_adapter_1 = require("@/lib/auth/nextauth-adapter");
async function POST(req, { params }) {
    try {
        const session = await (0, next_1.getServerSession)(nextauth_adapter_1.authOptions);
        if (!session?.user?.id) {
            return api_response_1.ApiResponse.error("UNAUTHORIZED", "Not authenticated", 401);
        }
        const { orgId, id: workflowId } = await params;
        // Parse optional input body safely
        let input = {};
        if (req.headers.get("content-type")?.includes("application/json")) {
            try {
                input = await req.json();
            }
            catch {
                // ignore parse errors for optional input
            }
        }
        const trigger = trigger_registry_1.TriggerRegistry.getTrigger("MANUAL");
        const executionId = await trigger.execute({
            organizationId: orgId,
            workflowId,
            userId: session.user.id,
            input
        });
        return api_response_1.ApiResponse.success({ id: executionId });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.startsWith("FORBIDDEN")) {
                return api_response_1.ApiResponse.error("FORBIDDEN", error.message, 403);
            }
            if (error.message.startsWith("WORKFLOW_NOT_FOUND")) {
                return api_response_1.ApiResponse.error("NOT_FOUND", error.message, 404);
            }
            return api_response_1.ApiResponse.error("BAD_REQUEST", error.message, 400);
        }
        return api_response_1.ApiResponse.error("INTERNAL_SERVER_ERROR", "Internal Server Error", 500);
    }
}
