import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { WorkflowExecutionService } from "@/services/workflow-execution.service";

// Force edge/dynamic execution for this route
export const dynamic = "force-dynamic";

/**
 * GET /api/cron/run-scheduled
 * 
 * Vercel Cron endpoint. Called periodically to run scheduled workflows.
 * Protected by CRON_SECRET header verification.
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Verify Vercel Cron Secret (prevents unauthorized execution)
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.warn("CRON auth failed: Invalid CRON_SECRET");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!cronSecret) {
      console.warn("CRON_SECRET is not set in environment. This endpoint is exposed.");
    }

    // 2. Fetch all ACTIVE workflows
    const activeWorkflows = await prisma.workflow.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        nodes: true,
        edges: true,
      },
    });

    // Filter to those with a START node configured as SCHEDULED_TRIGGER
    const activeScheduledWorkflows = activeWorkflows.filter((wf: any) => {
      const startNode = wf.nodes.find((n: any) => n.type === "START");
      if (!startNode) return false;
      
      const data = startNode.data as Record<string, unknown>;
      return data._triggerType === "SCHEDULED_TRIGGER";
    });

    if (activeScheduledWorkflows.length === 0) {
      return NextResponse.json({ success: true, message: "No scheduled workflows to run" });
    }

    // 3. Execute workflows asynchronously
    
    const executions = activeScheduledWorkflows.map(async (wf: any) => {
      try {
        // executeWebhookTrigger just creates an execution and runs it.
        // It fits our need perfectly since it verifies ACTIVE status and runs it in the background.
        await WorkflowExecutionService.executeWebhookTrigger(wf.organizationId, wf.id, { triggerSource: "cron" });
      } catch (error) {
        console.error(`Scheduled execution failed for workflow ${wf.id}:`, error);
      }
    });

    // Await them all so Vercel doesn't cut off execution prematurely.
    // In a very large app, this would be a message queue.
    await Promise.allSettled(executions);

    return NextResponse.json({ 
      success: true, 
      workflowsExecuted: activeScheduledWorkflows.length 
    });

  } catch (error) {
    console.error("Cron Execution Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
