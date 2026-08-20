import { getMockAutomation } from "@/lib/mock/automations";
import { notFound } from "next/navigation";
import { WorkflowCanvas } from "@/components/automations/workflow-canvas";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, Settings2 } from "lucide-react";
import Link from "next/link";
import { AutomationStatus } from "@/types/automations";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auto = await getMockAutomation(id);
  return { title: auto ? `${auto.name} — Flowra` : "Automation Not Found" };
}

export default async function AutomationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const automation = await getMockAutomation(id);
  if (!automation) notFound();

  const statusMap: Record<AutomationStatus, Parameters<typeof StatusIndicator>[0]["status"]> = {
    active: "active", paused: "paused", draft: "draft", error: "error",
  };

  const RUN_LOG = [
    { time: "2m ago",  status: "success", duration: "1.2s" },
    { time: "1h ago",  status: "success", duration: "0.9s" },
    { time: "3h ago",  status: "error",   duration: "5.1s" },
    { time: "1d ago",  status: "success", duration: "1.1s" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link href="/dashboard/automations"><Button variant="ghost" size="icon_sm"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-[var(--foreground)]">{automation.name}</h1>
              <StatusIndicator status={statusMap[automation.status]} />
            </div>
            <p className="text-sm text-[var(--muted)]">{automation.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-[var(--muted)]">
              <span>{automation.runCount} runs</span>
              <span>{automation.steps.length} steps</span>
              {automation.lastRunAt && <span>Last run {new Date(automation.lastRunAt).toLocaleDateString()}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="secondary" size="sm">
            {automation.status === "active" ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Activate</>}
          </Button>
          <Button variant="ghost" size="icon"><Settings2 className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Workflow visual */}
        <div className="lg:col-span-3 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]">
          <div className="px-5 py-4 border-b border-[var(--border)]">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Workflow steps</h2>
          </div>
          <WorkflowCanvas steps={automation.steps} />
        </div>

        {/* Run history */}
        <div className="lg:col-span-2 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]">
          <div className="px-5 py-4 border-b border-[var(--border)]">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Run history</h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {RUN_LOG.map((run, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${run.status === "success" ? "bg-[var(--success)]" : "bg-[var(--error)]"}`} />
                <div className="flex-1">
                  <p className="text-xs font-medium text-[var(--foreground)] capitalize">{run.status}</p>
                  <p className="text-[10px] text-[var(--muted)]">Duration: {run.duration}</p>
                </div>
                <span className="text-[10px] text-[var(--subtle)]">{run.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
