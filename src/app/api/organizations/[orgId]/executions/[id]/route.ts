import { NextRequest, NextResponse } from "next/server";
import { WorkflowExecutionService } from "@/services/workflow-execution.service";
import { ApiResponse } from "@/lib/api-response";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth-adapter";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string; id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return ApiResponse.error("UNAUTHORIZED", "Not authenticated", 401);
    }

    const { orgId, id: executionId } = await params;
    
    const execution = await WorkflowExecutionService.getExecution(
      orgId,
      executionId,
      session.user.id
    );

    return ApiResponse.success(execution);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.startsWith("FORBIDDEN")) {
        return ApiResponse.error("FORBIDDEN", error.message, 403);
      }
      if (error.message.startsWith("EXECUTION_NOT_FOUND")) {
        return ApiResponse.error("NOT_FOUND", error.message, 404);
      }
      return ApiResponse.error("BAD_REQUEST", error.message, 400);
    }
    
    return ApiResponse.error("INTERNAL_SERVER_ERROR", "Internal Server Error", 500);
  }
}
