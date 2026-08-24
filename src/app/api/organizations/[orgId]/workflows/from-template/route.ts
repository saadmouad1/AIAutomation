import { NextRequest } from "next/server";
import { handleApiError } from "@/lib/errors/handler";
import { requireRole, requireTenant } from "@/lib/tenant/context";
import { requireUser } from "@/lib/auth";
import { workflowService } from "@/services/workflow.service";
import { ApiResponse } from "@/lib/api-response";
import { getProductBySlug } from "@/lib/templates/product-definitions";
import { randomUUID } from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    // Must have create permission
    await requireRole(orgId, "workflow:create");

    // Get the authenticated user
    const user = await requireUser();
    const body = await req.json();

    if (!body.templateSlug) {
      throw new Error("Missing templateSlug in request body.");
    }

    const template = getProductBySlug(body.templateSlug);
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
      status: "DRAFT" as const, // Always start as DRAFT
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

    const workflow = await workflowService.create(orgId, user.id, workflowData);

    return ApiResponse.success(workflow, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
