"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const handler_1 = require("@/lib/errors/handler");
const context_1 = require("@/lib/tenant/context");
const auth_1 = require("@/lib/auth");
const workflow_service_1 = require("@/services/workflow.service");
const api_response_1 = require("@/lib/api-response");
const product_definitions_1 = require("@/lib/templates/product-definitions");
async function POST(req, { params }) {
    try {
        const { orgId } = await params;
        // Must have create permission
        await (0, context_1.requireRole)(orgId, "workflow:create");
        // Get the authenticated user
        const user = await (0, auth_1.requireUser)();
        const body = await req.json();
        if (!body.templateSlug) {
            throw new Error("Missing templateSlug in request body.");
        }
        const template = (0, product_definitions_1.getProductBySlug)(body.templateSlug);
        if (!template) {
            throw new Error(`Template not found: ${body.templateSlug}`);
        }
        if (template.implementationStatus === "COMING_SOON") {
            throw new Error(`Template ${template.name} is not yet available.`);
        }
        // Prepare workflow data from template.
        // The DB schema does not have a `trigger` JSON field directly on Workflow.
        // The nodes are what contain the trigger data.
        // We map the template nodes to generate unique UUIDs for them if needed,
        // but React Flow often expects stable IDs, so we can use the ones in the template
        // as long as they are unique to the workflow instance (which they are, per-workflow).
        // Let's just use the template's nodes directly but map their properties to match schema.
        const workflowData = {
            name: template.name,
            description: template.shortDescription,
            status: "DRAFT", // Always start as DRAFT
            nodes: template.templateNodes.map((n) => ({
                id: n.nodeId,
                type: n.type,
                position: { x: n.positionX, y: n.positionY },
                data: {
                    ...n.data,
                    // If this is the START node, inject the trigger type for our runtime
                    _triggerType: n.type === "START" ? template.triggerType : undefined
                },
            })),
            edges: template.templateEdges.map((e) => ({
                id: e.edgeId,
                source: e.source,
                target: e.target,
                sourceHandle: e.sourceHandle ?? null,
                targetHandle: e.targetHandle ?? null,
            })),
        };
        const workflow = await workflow_service_1.workflowService.create(orgId, user.id, workflowData);
        return api_response_1.ApiResponse.success(workflow, 201);
    }
    catch (error) {
        return (0, handler_1.handleApiError)(error);
    }
}
