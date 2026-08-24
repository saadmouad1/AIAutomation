import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { listUserOrganizations } from "@/repositories/organization.repository";
import { db as prisma } from "@/lib/db";
import { StatCard } from "@/components/ui/stat-card";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Zap, PlayCircle, CheckCircle, Clock, ArrowRight, LayoutTemplate, Settings2 } from "lucide-react";
import Link from "next/link";
import { AUTOMATION_PRODUCTS } from "@/lib/templates/product-definitions";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  if (session.user.email === "flowra.ai") {
    redirect("/admin");
  }

  const orgs = await listUserOrganizations(session.user.id);
  if (orgs.length === 0) redirect("/dashboard");
  const orgId = orgs[0].id;

  const firstName = session.user.name?.split(" ")[0] || "there";

  // Fetch real data
  const [activeWorkflowsCount, totalWorkflowsCount, executionsCount, recentExecutions, recentWorkflows] = await Promise.all([
    prisma.workflow.count({ where: { organizationId: orgId, status: "ACTIVE" } }),
    prisma.workflow.count({ where: { organizationId: orgId } }),
    prisma.workflowExecution.count({ where: { organizationId: orgId } }),
    prisma.workflowExecution.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { workflow: { select: { name: true } } }
    }),
    prisma.workflow.findMany({
      where: { organizationId: orgId },
      orderBy: { updatedAt: "desc" },
      take: 3,
    })
  ]);

  const successCount = await prisma.workflowExecution.count({ where: { organizationId: orgId, status: "SUCCESS" } });
  const successRate = executionsCount > 0 ? Math.round((successCount / executionsCount) * 100) : 0;

  // Grab a few top templates for the showcase
  const showcaseTemplates = AUTOMATION_PRODUCTS.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-up pb-10">
      
      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-[var(--muted)] mt-1.5 text-lg">
            Automate the repetitive work. Focus on growing your business.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild className="h-11">
            <Link href="/dashboard/templates">
              <LayoutTemplate className="h-4 w-4 mr-2" />
              Browse Products
            </Link>
          </Button>
          <Button asChild className="h-11 bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] shadow-[0_0_16px_-4px_rgba(99,91,255,0.4)]">
            <Link href="/dashboard/automations/new">
              <Zap className="h-4 w-4 mr-2" />
              Create Automation
            </Link>
          </Button>
        </div>
      </div>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Automations" value={activeWorkflowsCount.toString()} icon={Zap} />
        <StatCard title="Total Automations" value={totalWorkflowsCount.toString()} icon={LayoutTemplate} />
        <StatCard title="Total Executions" value={executionsCount.toString()} icon={PlayCircle} />
        <StatCard title="Success Rate" value={`${successRate}%`} icon={CheckCircle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── LEFT COLUMN: WORKFLOWS & TEMPLATES ─────────────────────────── */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Your Automations */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--foreground)]">Your Automations</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/automations">View all</Link>
              </Button>
            </div>
            
            {recentWorkflows.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {recentWorkflows.map((wf: any) => (
                  <GlassCard key={wf.id} className="p-4 flex items-center justify-between group hover:border-[var(--brand-border)] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-[var(--brand-light)] flex items-center justify-center">
                        <Zap className="h-5 w-5 text-[var(--brand)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--foreground)]">{wf.name}</h3>
                        <p className="text-xs text-[var(--muted)] flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center h-2 w-2 rounded-full ${wf.status === 'ACTIVE' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                          {wf.status} • Updated {formatDistanceToNow(wf.updatedAt, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/dashboard/automations/${wf.id}`}>
                        <Settings2 className="h-4 w-4 text-[var(--muted)]" />
                      </Link>
                    </Button>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <GlassCard className="p-8 text-center border-dashed">
                <div className="h-12 w-12 rounded-full bg-[var(--surface-elevated)] mx-auto flex items-center justify-center mb-3">
                  <LayoutTemplate className="h-6 w-6 text-[var(--muted)]" />
                </div>
                <h3 className="font-semibold text-[var(--foreground)]">No automations yet</h3>
                <p className="text-sm text-[var(--muted)] mt-1 mb-4 max-w-sm mx-auto">
                  Start by browsing our ready-made automation products or build one from scratch.
                </p>
                <Button size="sm" asChild>
                  <Link href="/dashboard/templates">Browse Automation Products</Link>
                </Button>
              </GlassCard>
            )}
          </div>

          {/* Recommended Automation Products */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--foreground)]">Recommended Products</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/templates">View catalog</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {showcaseTemplates.map(t => (
                <div key={t.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 hover:border-[var(--brand-border)] transition-colors flex flex-col h-full">
                  <div className="flex-1">
                    <div className="h-8 w-8 rounded-lg mb-3 flex items-center justify-center" style={{ backgroundColor: `${t.color}22` }}>
                      <Zap className="h-4 w-4" style={{ color: t.color }} />
                    </div>
                    <h3 className="font-semibold text-[var(--foreground)] text-sm mb-1">{t.name}</h3>
                    <p className="text-xs text-[var(--muted)] leading-relaxed mb-4">{t.shortDescription}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                    <Link href="/dashboard/templates">Learn More</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: EXECUTIONS ─────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--foreground)]">Recent Executions</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/executions">View all</Link>
            </Button>
          </div>

          <GlassCard className="p-0 overflow-hidden divide-y divide-[var(--border)]">
            {recentExecutions.length > 0 ? (
              recentExecutions.map((exec: any) => (
                <div key={exec.id} className="p-4 hover:bg-[var(--surface-elevated)] transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate pr-4">
                      {exec.workflow.name}
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                      exec.status === 'SUCCESS' ? 'bg-green-500/10 text-green-500' :
                      exec.status === 'FAILED' ? 'bg-red-500/10 text-red-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {exec.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {exec.startedAt ? formatDistanceToNow(exec.startedAt, { addSuffix: true }) : 'Pending'}
                    </span>
                    {exec.completedAt && exec.startedAt && (
                      <span>
                        {(exec.completedAt.getTime() - exec.startedAt.getTime())}ms
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-[var(--muted)]">
                No executions yet.
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
