import { db as prisma } from "@/lib/db";
import { StatCard } from "@/components/ui/stat-card";
import { GlassCard } from "@/components/ui/glass-card";
import { Users, Building2, Webhook, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Aggregate stats across the entire platform
  const [
    totalUsers,
    totalOrgs,
    totalWorkflows,
    totalExecutions,
    recentUsers,
    recentOrgs
  ] = await Promise.all([
    prisma.user.count(),
    prisma.organization.count(),
    prisma.workflow.count(),
    prisma.workflowExecution.count(),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, email: true, name: true, createdAt: true } }),
    prisma.organization.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, name: true, createdAt: true } })
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">Platform Overview</h1>
        <p className="text-[var(--muted)] mt-1">Monitor the global health and usage of Flowra AI.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={totalUsers.toString()} icon={Users} />
        <StatCard title="Total Organizations" value={totalOrgs.toString()} icon={Building2} />
        <StatCard title="Total Workflows" value={totalWorkflows.toString()} icon={Webhook} />
        <StatCard title="Total Executions" value={totalExecutions.toString()} icon={Activity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">Latest Registered Users</h2>
          <div className="space-y-3">
            {recentUsers.map((u: any) => (
              <div key={u.id} className="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{u.name || "No Name"}</p>
                  <p className="text-xs text-[var(--muted)]">{u.email}</p>
                </div>
                <span className="text-xs text-[var(--subtle)]">{new Date(u.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">Latest Organizations</h2>
          <div className="space-y-3">
            {recentOrgs.map((org: any) => (
              <div key={org.id} className="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-0">
                <p className="text-sm font-medium text-[var(--foreground)]">{org.name}</p>
                <span className="text-xs text-[var(--subtle)]">{new Date(org.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
