import { NextRequest, NextResponse } from "next/server";
import { TriggerRegistry } from "@/lib/automation/triggers/trigger-registry";
import { ApiResponse } from "@/lib/api-response";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth-adapter";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string; id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return ApiResponse.error("UNAUTHORIZED", "Not authenticated", 401);
    }

    const { orgId, id: workflowId } = await params;
    
    // Parse optional input body safely
    let input = {};
    if (req.headers.get("content-type")?.includes("application/json")) {
      try {
        input = await req.json();
      } catch {
        // ignore parse errors for optional input
      }
    }

    const trigger = TriggerRegistry.getTrigger("MANUAL");
    const executionId = await trigger.execute({
      organizationId: orgId,
      workflowId,
      userId: session.user.id,
      input
    });

    return ApiResponse.success({ id: executionId });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.startsWith("FORBIDDEN")) {
        return ApiResponse.error("FORBIDDEN", error.message, 403);
      }
      if (error.message.startsWith("WORKFLOW_NOT_FOUND")) {
        return ApiResponse.error("NOT_FOUND", error.message, 404);
      }
      return ApiResponse.error("BAD_REQUEST", error.message, 400);
    }
    
    return ApiResponse.error("INTERNAL_SERVER_ERROR", "Internal Server Error", 500);
  }
}
