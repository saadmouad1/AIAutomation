import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { listUserOrganizations } from "@/repositories/organization.repository";
import { workflowService } from "@/services/workflow.service";
import { AutomationCard } from "@/components/automations/automation-card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Webhook, Plus, Zap, LayoutTemplate } from "lucide-react";
import Link from "next/link";
import type { WorkflowListItem } from "@/types/automations";

export const metadata = { title: "Automations — Flowra" };
export const dynamic = "force-dynamic";

export default async function AutomationsPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  // Resolve the user's primary organization
  const orgs = await listUserOrganizations(session.user.id);
  if (orgs.length === 0) redirect("/dashboard");

  const orgId = orgs[0].id;
  const workflows = (await workflowService.list(orgId)) as WorkflowListItem[];

  const active = workflows.filter((w) => w.status === "ACTIVE").length;
  const draft = workflows.filter((w) => w.status === "DRAFT").length;
  const paused = workflows.filter((w) => w.status === "PAUSED").length;

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-up pb-20">
      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-strong)]">
            <Webhook className="h-6 w-6 text-[var(--foreground)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">
              Automations
            </h1>
            <p className="text-[var(--muted)] mt-1.5 text-lg">
              Manage your workflows and custom automations.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild className="h-11">
            <Link href="/dashboard/templates">
              <LayoutTemplate className="h-4 w-4 mr-2" />
              Browse Products
            </Link>
          </Button>
          <Button asChild className="h-11 bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] shadow-[0_0_16px_-4px_rgba(99,91,255,0.4)]">
            <Link href={`/dashboard/automations/new?orgId=${orgId}`}>
              <Plus className="h-4 w-4 mr-2" />
              Custom Workflow
            </Link>
          </Button>
        </div>
      </div>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Active"  value={active}           icon={Zap} />
        <StatCard title="Draft"   value={draft}            icon={Webhook} />
        <StatCard title="Paused"  value={paused}           icon={Webhook} />
        <StatCard title="Total"   value={workflows.length} icon={Webhook} />
      </div>

      {/* ── LIST ─────────────────────────────────────────────────────────── */}
      {workflows.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-[var(--border-strong)] rounded-2xl bg-[var(--surface-elevated)]">
          <div className="h-12 w-12 rounded-full bg-[var(--surface)] mx-auto flex items-center justify-center mb-4 border border-[var(--border)]">
            <Webhook className="h-6 w-6 text-[var(--muted)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">No automations yet</h3>
          <p className="text-sm text-[var(--muted)] mt-2 mb-6 max-w-md mx-auto">
            You don't have any custom automations yet. Create one from scratch or browse our catalog of ready-made products.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/dashboard/templates">Browse Products</Link>
            </Button>
            <Button asChild className="bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]">
              <Link href={`/dashboard/automations/new?orgId=${orgId}`}>Create Custom Workflow</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {workflows.map((wf: WorkflowListItem) => (
            <AutomationCard key={wf.id} workflow={wf} />
          ))}
        </div>
      )}
    </div>
  );
}
