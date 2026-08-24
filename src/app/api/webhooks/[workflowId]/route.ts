import { NextRequest, NextResponse } from "next/server";
import { TriggerRegistry } from "@/lib/automation/triggers/trigger-registry";
import { getWorkflowByIdUnscoped } from "@/repositories/workflow.repository";
import { ApiResponse } from "@/lib/api-response";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  try {
    const { workflowId } = await params;

    // 1. Fetch workflow without org context to get organizationId
    const workflow = await getWorkflowByIdUnscoped(workflowId);
    if (!workflow) {
      return ApiResponse.error("NOT_FOUND", "Workflow not found.", 404);
    }

    if (workflow.status !== "ACTIVE") {
      return ApiResponse.error("BAD_REQUEST", "Workflow is not ACTIVE.", 400);
    }

    // 2. Parse input
    let input: Record<string, unknown> = {};
    if (req.headers.get("content-type")?.includes("application/json")) {
      try {
        input = await req.json();
      } catch {
        // ignore parse errors
      }
    }

    // 3. Execute webhook trigger
    const trigger = TriggerRegistry.getTrigger("WEBHOOK");
    const executionId = await trigger.execute({
      workflowId,
      organizationId: workflow.organizationId,
      input: {
        body: input,
        headers: Object.fromEntries(req.headers.entries()),
      },
    });

    return ApiResponse.success({ executionId }, 202); // 202 Accepted
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.startsWith("INVALID_STATUS")) {
        return ApiResponse.error("BAD_REQUEST", error.message, 400);
      }
    }
    console.error("[Webhook Error]", error);
    return ApiResponse.error("INTERNAL_SERVER_ERROR", "Internal Server Error", 500);
  }
}
