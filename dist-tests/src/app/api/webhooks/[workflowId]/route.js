"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const trigger_registry_1 = require("@/lib/automation/triggers/trigger-registry");
const workflow_repository_1 = require("@/repositories/workflow.repository");
const api_response_1 = require("@/lib/api-response");
async function POST(req, { params }) {
    try {
        const { workflowId } = await params;
        // 1. Fetch workflow without org context to get organizationId
        const workflow = await (0, workflow_repository_1.getWorkflowByIdUnscoped)(workflowId);
        if (!workflow) {
            return api_response_1.ApiResponse.error("NOT_FOUND", "Workflow not found.", 404);
        }
        if (workflow.status !== "ACTIVE") {
            return api_response_1.ApiResponse.error("BAD_REQUEST", "Workflow is not ACTIVE.", 400);
        }
        // 2. Parse input
        let input = {};
        if (req.headers.get("content-type")?.includes("application/json")) {
            try {
                input = await req.json();
            }
            catch {
                // ignore parse errors
            }
        }
        // 3. Execute webhook trigger
        const trigger = trigger_registry_1.TriggerRegistry.getTrigger("WEBHOOK");
        const executionId = await trigger.execute({
            workflowId,
            organizationId: workflow.organizationId,
            input: {
                body: input,
                headers: Object.fromEntries(req.headers.entries()),
            },
        });
        return api_response_1.ApiResponse.success({ executionId }, 202); // 202 Accepted
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.startsWith("INVALID_STATUS")) {
                return api_response_1.ApiResponse.error("BAD_REQUEST", error.message, 400);
            }
        }
        console.error("[Webhook Error]", error);
        return api_response_1.ApiResponse.error("INTERNAL_SERVER_ERROR", "Internal Server Error", 500);
    }
}
