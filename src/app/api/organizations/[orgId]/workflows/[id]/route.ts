import { NextRequest } from "next/server";
import { handleApiError } from "@/lib/errors/handler";
import { requireRole, requireTenant } from "@/lib/tenant/context";
import { workflowService } from "@/services/workflow.service";
import { ApiResponse } from "@/lib/api-response";

type RouteContext = { params: Promise<{ orgId: string; id: string }> };

// GET /api/organizations/:orgId/workflows/:id
export async function GET(
  _req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { orgId, id } = await params;
    await requireTenant(orgId);
    const workflow = await workflowService.getById(id, orgId);
    return ApiResponse.success(workflow);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/organizations/:orgId/workflows/:id
export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { orgId, id } = await params;
    await requireRole(orgId, "workflow:update");
    const body = await req.json();
    const workflow = await workflowService.update(id, orgId, body);
    return ApiResponse.success(workflow);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/organizations/:orgId/workflows/:id
export async function DELETE(
  _req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { orgId, id } = await params;
    await requireRole(orgId, "workflow:delete");
    await workflowService.delete(id, orgId);
    return ApiResponse.success({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
