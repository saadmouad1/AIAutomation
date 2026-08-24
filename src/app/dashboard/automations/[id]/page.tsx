import { getSession } from "@/lib/auth/session";
import { redirect, notFound } from "next/navigation";
import { listUserOrganizations } from "@/repositories/organization.repository";
import { workflowService } from "@/services/workflow.service";
import { WorkflowCanvas } from "@/components/automations/workflow-canvas";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Settings2 } from "lucide-react";
import Link from "next/link";
import type { WorkflowStatus, WorkflowRecord } from "@/types/automations";
import type { Node, Edge } from "@xyflow/react";
import { WorkflowStatusControls } from "@/components/automations/workflow-status-controls";
import { WebhookUrlCard } from "@/components/automations/webhook-url-card";
import { ExecutionHistory } from "@/components/automations/execution-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `Workflow ${id} — Flowra` };
}

export default async function AutomationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const orgs = await listUserOrganizations(session.user.id);
  if (orgs.length === 0) redirect("/dashboard");

  const orgId = orgs[0].id;

  let workflow: WorkflowRecord;
  try {
    workflow = await workflowService.getById(id, orgId) as WorkflowRecord;
  } catch {
    notFound();
  }

  const statusMap: Record<WorkflowStatus, Parameters<typeof StatusIndicator>[0]["status"]> = {
    ACTIVE: "active",
    PAUSED: "paused",
    DRAFT: "draft",
  };

  // Reconstruct React Flow nodes from DB records
  const initialNodes: Node[] = workflow.nodes.map((n) => ({
    id: n.nodeId,
    type: n.type,
    position: { x: n.positionX, y: n.positionY },
    data: n.data as Record<string, unknown>,
  }));

  // Reconstruct React Flow edges from DB records
  const initialEdges: Edge[] = workflow.edges.map((e) => ({
    id: e.edgeId,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle ?? undefined,
    targetHandle: e.targetHandle ?? undefined,
    animated: true,
    style: { stroke: "rgba(99,91,255,0.5)", strokeWidth: 2 },
  }));

  return (
    <div className="mx-auto space-y-6 animate-fade-up max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link href="/dashboard/automations">
            <Button variant="ghost" size="icon_sm"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-text-primary">{workflow.name}</h1>
              <StatusIndicator status={statusMap[workflow.status]} />
              <Badge variant="outline" className="text-[10px]">v{workflow.version}</Badge>
            </div>
            <p className="text-sm text-text-muted">{workflow.description ?? "No description"}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
              <span>{workflow.nodes.length} nodes</span>
              <span>{workflow.edges.length} edges</span>
              <span>Updated {new Date(workflow.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <WorkflowStatusControls 
            orgId={orgId} 
            workflowId={workflow.id} 
            currentStatus={workflow.status} 
          />
          <Button variant="ghost" size="icon"><Settings2 className="h-4 w-4" /></Button>
        </div>
      </div>

      <WebhookUrlCard workflowId={workflow.id} isActive={workflow.status === "ACTIVE"} />

      <Tabs defaultValue="builder" className="w-full">
        <TabsList>
          <TabsTrigger value="builder">Builder</TabsTrigger>
          <TabsTrigger value="history">Execution History</TabsTrigger>
        </TabsList>
        <TabsContent value="builder" className="mt-4">
          <div className="hidden lg:block">
            <WorkflowCanvas
              workflowId={workflow.id}
              orgId={orgId}
              initialNodes={initialNodes}
              initialEdges={initialEdges}
            />
          </div>
          <div className="lg:hidden p-8 border border-dashed border-surface-border rounded-xl text-center">
            <p className="text-sm text-text-muted">
              Workflow Builder is optimized for desktop. Please open this page on a larger screen to build and edit workflows.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <ExecutionHistory orgId={orgId} workflowId={workflow.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
