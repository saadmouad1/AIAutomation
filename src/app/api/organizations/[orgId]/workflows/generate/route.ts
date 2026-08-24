import { NextRequest, NextResponse } from "next/server";
import { AiWorkflowGeneratorService } from "@/services/ai-workflow-generator.service";
import { ApiResponse } from "@/lib/api-response";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth-adapter";
import { getMember } from "@/repositories/member.repository";
import { hasPermission } from "@/lib/tenant/permissions";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return ApiResponse.error("UNAUTHORIZED", "Not authenticated", 401);
    }

    const { orgId } = await params;

    // Verify membership and permission
    const membership = await getMember(orgId, session.user.id);
    if (!membership) {
      return ApiResponse.error("FORBIDDEN", "Not a member of the organization", 403);
    }

    // Creating/Generating workflows typically requires ADMIN or OWNER, or at least workflow:create
    if (!hasPermission(membership.role, "workflow:create")) {
      return ApiResponse.error("FORBIDDEN", "You do not have permission to generate workflows.", 403);
    }

    const body = await req.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return ApiResponse.error("BAD_REQUEST", "A valid 'prompt' string is required.", 400);
    }

    const generatedWorkflow = await AiWorkflowGeneratorService.generateWorkflow(prompt);

    return ApiResponse.success(generatedWorkflow);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("AI_PROVIDER_UNAVAILABLE")) {
        return ApiResponse.error("SERVICE_UNAVAILABLE", "AI features are currently unavailable.", 503);
      }
      return ApiResponse.error("BAD_REQUEST", error.message, 400);
    }
    
    return ApiResponse.error("INTERNAL_SERVER_ERROR", "Internal Server Error", 500);
  }
}
