import { NextRequest } from "next/server";
import { handleApiError } from "@/lib/errors/handler";
import { requireRole, requireTenant } from "@/lib/tenant/context";
import { requireUser } from "@/lib/auth";
import { workflowService } from "@/services/workflow.service";
import { ApiResponse } from "@/lib/api-response";

// GET /api/organizations/:orgId/workflows — list all workflows in the org
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    // Any member can read workflows
    await requireTenant(orgId);
    const workflows = await workflowService.list(orgId);
    return ApiResponse.success(workflows);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/organizations/:orgId/workflows — create a new workflow
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    // Must have create permission
    await requireRole(orgId, "workflow:create");

    // Get the authenticated user — createdById NEVER comes from the client
    const user = await requireUser();
    const body = await req.json();

    const workflow = await workflowService.create(orgId, user.id, body);
    return ApiResponse.success(workflow, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
