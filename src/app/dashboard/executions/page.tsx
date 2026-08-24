import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { listUserOrganizations } from "@/repositories/organization.repository";
import { db as prisma } from "@/lib/db";
import { GlassCard } from "@/components/ui/glass-card";
import { CheckSquare, Clock, Webhook, MonitorPlay } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Executions — Flowra",
  description: "View the execution history of all your automations.",
};

export default async function ExecutionsPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const orgs = await listUserOrganizations(session.user.id);
  if (orgs.length === 0) redirect("/dashboard");
  const orgId = orgs[0].id;

  const executions = await prisma.workflowExecution.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      workflow: { select: { name: true, id: true } }
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-up pb-20">
      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-start gap-4">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-strong)]">
          <MonitorPlay className="h-6 w-6 text-[var(--foreground)]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">
            Executions
          </h1>
          <p className="text-[var(--muted)] mt-1.5 text-lg max-w-2xl">
            A real-time log of everything happening across your automation products.
          </p>
        </div>
      </div>

      {/* ── LIST ─────────────────────────────────────────────────────────── */}
      <GlassCard className="p-0 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--surface-elevated)] text-[var(--muted)] border-b border-[var(--border)]">
              <tr>
                <th className="font-medium px-6 py-4">Status</th>
                <th className="font-medium px-6 py-4">Automation</th>
                <th className="font-medium px-6 py-4">Trigger</th>
                <th className="font-medium px-6 py-4">Started</th>
                <th className="font-medium px-6 py-4">Duration</th>
                <th className="font-medium px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
              {executions.length > 0 ? (
                executions.map((exec: any) => {
                  const wfData = exec.definition as any;
                  // Look for start node to find trigger info (very simplistic for UI purposes)
                  const startNode = Array.isArray(wfData?.nodes) ? wfData.nodes.find((n: any) => n.type === "START") : null;
                  const triggerName = startNode?.data?.label || "Webhook";

                  return (
                    <tr key={exec.id} className="hover:bg-[var(--surface-elevated)]/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center justify-center text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${
                          exec.status === 'SUCCESS' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                          exec.status === 'FAILED' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                          exec.status === 'RUNNING' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 animate-pulse' :
                          'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        }`}>
                          {exec.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-[var(--foreground)]">
                        {exec.workflow?.name || "Deleted Automation"}
                      </td>
                      <td className="px-6 py-4 text-[var(--muted)]">
                        <div className="flex items-center gap-2">
                          <Webhook className="h-3.5 w-3.5" />
                          {triggerName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[var(--muted)]">
                        {exec.startedAt ? (
                          <div title={format(exec.startedAt, "PPpp")}>
                            {formatDistanceToNow(exec.startedAt, { addSuffix: true })}
                          </div>
                        ) : "—"}
                      </td>
                      <td className="px-6 py-4 text-[var(--muted)]">
                        {exec.completedAt && exec.startedAt ? (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            {(exec.completedAt.getTime() - exec.startedAt.getTime())}ms
                          </div>
                        ) : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {exec.workflow?.id ? (
                          <Button variant="ghost" size="sm" className="text-xs" asChild>
                            <Link href={`/dashboard/automations/${exec.workflow.id}?tab=history`}>
                              View
                            </Link>
                          </Button>
                        ) : (
                          <span className="text-xs text-[var(--subtle)]">N/A</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-elevated)] mb-4">
                      <CheckSquare className="h-6 w-6 text-[var(--muted)]" />
                    </div>
                    <p className="text-[var(--foreground)] font-medium mb-1">No executions yet.</p>
                    <p className="text-sm text-[var(--muted)]">Activate an automation to start seeing history here.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
