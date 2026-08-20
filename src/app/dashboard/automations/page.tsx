import { getMockAutomations } from "@/lib/mock/automations";
import { AutomationCard } from "@/components/automations/automation-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Webhook, Plus, Zap } from "lucide-react";
import Link from "next/link";
import { Automation } from "@/types/automations";

export const metadata = { title: "Automations — Flowra" };

export default async function AutomationsPage() {
  const automations = await getMockAutomations();
  const active = automations.filter(a => a.status === "active").length;
  const totalRuns = automations.reduce((acc, a) => acc + a.runCount, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Webhook className="h-5 w-5 text-[var(--brand)]" />
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Automations</h1>
          </div>
          <p className="text-sm text-[var(--muted)]">Workflows that run your business</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/automations/new"><Plus className="h-4 w-4" /> New workflow</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Active"      value={active}     icon={Zap} />
        <StatCard title="Total Runs"  value={totalRuns}  trend={{ value: 24 }} icon={Webhook} />
        <StatCard title="Total"       value={automations.length} icon={Webhook} />
      </div>

      {/* List */}
      {automations.length === 0 ? (
        <EmptyState
          icon={Webhook}
          title="No workflows yet"
          description="Create your first workflow and let Flowra handle the repetitive work."
          action={{ label: "Create workflow", href: "/dashboard/automations/new" }}
        />
      ) : (
        <div className="space-y-3">
          {automations.map((auto: Automation) => (
            <AutomationCard key={auto.id} automation={auto} />
          ))}
        </div>
      )}
    </div>
  );
}
