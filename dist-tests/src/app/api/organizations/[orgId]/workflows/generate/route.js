"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const ai_workflow_generator_service_1 = require("@/services/ai-workflow-generator.service");
const api_response_1 = require("@/lib/api-response");
const next_1 = require("next-auth/next");
const nextauth_adapter_1 = require("@/lib/auth/nextauth-adapter");
const member_repository_1 = require("@/repositories/member.repository");
const permissions_1 = require("@/lib/tenant/permissions");
async function POST(req, { params }) {
    try {
        const session = await (0, next_1.getServerSession)(nextauth_adapter_1.authOptions);
        if (!session?.user?.id) {
            return api_response_1.ApiResponse.error("UNAUTHORIZED", "Not authenticated", 401);
        }
        const { orgId } = await params;
        // Verify membership and permission
        const membership = await (0, member_repository_1.getMember)(orgId, session.user.id);
        if (!membership) {
            return api_response_1.ApiResponse.error("FORBIDDEN", "Not a member of the organization", 403);
        }
        // Creating/Generating workflows typically requires ADMIN or OWNER, or at least workflow:create
        if (!(0, permissions_1.hasPermission)(membership.role, "workflow:create")) {
            return api_response_1.ApiResponse.error("FORBIDDEN", "You do not have permission to generate workflows.", 403);
        }
        const body = await req.json();
        const { prompt } = body;
        if (!prompt || typeof prompt !== "string") {
            return api_response_1.ApiResponse.error("BAD_REQUEST", "A valid 'prompt' string is required.", 400);
        }
        const generatedWorkflow = await ai_workflow_generator_service_1.AiWorkflowGeneratorService.generateWorkflow(prompt);
        return api_response_1.ApiResponse.success(generatedWorkflow);
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("AI_PROVIDER_UNAVAILABLE")) {
                return api_response_1.ApiResponse.error("SERVICE_UNAVAILABLE", "AI features are currently unavailable.", 503);
            }
            return api_response_1.ApiResponse.error("BAD_REQUEST", error.message, 400);
        }
        return api_response_1.ApiResponse.error("INTERNAL_SERVER_ERROR", "Internal Server Error", 500);
    }
}
