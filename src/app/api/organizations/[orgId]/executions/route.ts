import { NextRequest, NextResponse } from "next/server";
import { WorkflowExecutionService } from "@/services/workflow-execution.service";
import { ApiResponse } from "@/lib/api-response";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth-adapter";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return ApiResponse.error("UNAUTHORIZED", "Not authenticated", 401);
    }

    const { orgId } = await params;
    
    // Parse optional workflowId query param
    const searchParams = req.nextUrl.searchParams;
    const workflowId = searchParams.get("workflowId") || undefined;

    const executions = await WorkflowExecutionService.listExecutions(
      orgId,
      session.user.id,
      workflowId
    );

    return ApiResponse.success(executions);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.startsWith("FORBIDDEN")) {
        return ApiResponse.error("FORBIDDEN", error.message, 403);
      }
      return ApiResponse.error("BAD_REQUEST", error.message, 400);
    }
    
    return ApiResponse.error("INTERNAL_SERVER_ERROR", "Internal Server Error", 500);
  }
}
