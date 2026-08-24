import { getSession } from "@/lib/auth/session";
import { redirect, notFound } from "next/navigation";
import { listUserOrganizations } from "@/repositories/organization.repository";
import { workflowService } from "@/services/workflow.service";
import { WorkflowExecutionService } from "@/services/workflow-execution.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, CheckSquare, Terminal, Variable, Type, Split, Globe, Sparkles, CheckCircle2, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { StatusIndicator } from "@/components/ui/status-indicator";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string; executionId: string }> }) {
  const { executionId } = await params;
  return { title: `Execution ${executionId.split('-')[0]} — Flowra` };
}

const nodeIcons: Record<string, React.ElementType> = {
  START: Play,
  END: CheckSquare,
  LOG: Terminal,
  SET_VALUE: Variable,
  TRANSFORM: Type,
  CONDITION: Split,
  HTTP_REQUEST: Globe,
  AI_GENERATE: Sparkles,
};

export default async function ExecutionDetailPage({ params }: { params: Promise<{ id: string; executionId: string }> }) {
  const { id, executionId } = await params;

  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const orgs = await listUserOrganizations(session.user.id);
  if (orgs.length === 0) redirect("/dashboard");

  const orgId = orgs[0].id;

  let workflow;
  let execution;
  try {
    workflow = await workflowService.getById(id, orgId);
    execution = await WorkflowExecutionService.getExecution(orgId, executionId, session.user.id);
  } catch {
    notFound();
  }

  const getStatusType = (status: string) => {
    switch (status) {
      case "SUCCESS": return "active";
      case "FAILED": return "error";
      case "RUNNING": return "pending";
      case "PENDING": return "pending";
      default: return "draft";
    }
  };

  const startedAt = execution.startedAt ? new Date(execution.startedAt) : new Date();
  const completedAt = execution.completedAt ? new Date(execution.completedAt) : null;
  const duration = completedAt ? Math.max(0, completedAt.getTime() - startedAt.getTime()) : null;

  // We need to render the execution timeline based on the nodes that were executed.
  // execution.nodeResults is a Record<nodeId, { status, startedAt, completedAt, error, output }>
  // We can also extract the sequence if possible, or just sort them by startedAt.
  
  const nodeResultsArray = Object.entries(execution.nodeResults || {}).map(([nodeId, result]: [string, any]) => {
    // Find the original node to get its type and name
    const definition = execution.definition as { nodes: any[] };
    const originalNode = definition?.nodes?.find((n: any) => n.id === nodeId);
    
    return {
      nodeId,
      type: originalNode?.type || "UNKNOWN",
      title: originalNode?.data?.title || originalNode?.type || "Unknown Node",
      ...result,
      startedAtTime: new Date(result.startedAt).getTime()
    };
  }).sort((a, b) => a.startedAtTime - b.startedAtTime);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
      <div className="flex items-start gap-3">
        <Link href={`/dashboard/automations/${id}`}>
          <Button variant="ghost" size="icon_sm"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold text-text-primary">Execution Detail</h1>
            <StatusIndicator status={getStatusType(execution.status)} />
          </div>
          <div className="text-sm text-text-muted flex items-center gap-2">
            <span>Workflow: {workflow.name}</span>
            <span>•</span>
            <Badge variant="outline" className="text-[10px]">v{execution.workflowVersion}</Badge>
            <span>•</span>
            <span className="font-mono text-xs">{execution.id}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface p-4 rounded-xl border border-surface-border">
          <div className="text-xs text-text-muted mb-1 uppercase tracking-wider">Started</div>
          <div className="text-sm font-medium text-text-primary">{startedAt.toLocaleString()}</div>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-surface-border">
          <div className="text-xs text-text-muted mb-1 uppercase tracking-wider">Completed</div>
          <div className="text-sm font-medium text-text-primary">{completedAt ? completedAt.toLocaleString() : "-"}</div>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-surface-border">
          <div className="text-xs text-text-muted mb-1 uppercase tracking-wider">Duration</div>
          <div className="text-sm font-medium text-text-primary">{duration !== null ? `${duration}ms` : "-"}</div>
        </div>
      </div>

      {execution.error && (
        <div className="bg-error/10 border border-error/20 p-4 rounded-xl">
          <h3 className="text-sm font-semibold text-error flex items-center gap-2">
            <XCircle className="h-4 w-4" /> Execution Failed
          </h3>
          <p className="text-sm text-error/90 mt-1">{execution.error}</p>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-text-primary mb-4">Execution Timeline</h2>
        <div className="space-y-4">
          {nodeResultsArray.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-surface-border rounded-xl">
              <p className="text-sm text-text-muted">No nodes executed.</p>
            </div>
          ) : (
            <div className="relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-border before:to-transparent">
              {nodeResultsArray.map((result, index) => {
                const Icon = nodeIcons[result.type] || Play;
                const nodeDuration = result.completedAt ? Math.max(0, new Date(result.completedAt).getTime() - result.startedAtTime) : 0;
                
                return (
                  <div key={result.nodeId} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-surface-elevated text-text-muted shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-surface-border bg-surface shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-text-primary">{result.title}</h4>
                          <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">{result.type}</span>
                        </div>
                        {result.status === "SUCCESS" && <CheckCircle2 className="h-4 w-4 text-success" />}
                        {result.status === "FAILED" && <XCircle className="h-4 w-4 text-error" />}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-text-muted mt-2">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {nodeDuration}ms</span>
                      </div>

                      {result.error && (
                        <div className="mt-3 p-2 bg-error/10 text-error text-xs rounded border border-error/20">
                          {result.error}
                        </div>
                      )}
                      
                      {/* Note: We do not display full output here to avoid leaking secrets inadvertently, 
                          but we could display safe metadata if desired. */}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
