import { getSession } from "@/lib/auth/session";
import { StatCard } from "@/components/ui/stat-card";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Webhook, Users, FileText, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

const QUICK_SUGGESTIONS = [
  "Capture leads from my website form",
  "Send a confirmation when someone submits a form",
  "Notify my team about high-priority requests",
  "Create a task when a customer needs follow-up",
];

const RECENT_ACTIVITY = [
  { icon: Webhook, label: "Lead qualification workflow ran",  sub: "Processed 3 new submissions", time: "2m ago" },
  { icon: Users,   label: "New contact added",                sub: "Alice Smith was added to CRM", time: "1h ago" },
  { icon: FileText, label: "Form submission received",        sub: "Contact form · 1 response",    time: "3h ago" },
  { icon: Zap,     label: "Automation completed",             sub: "Email confirmation sent",       time: "5h ago" },
];

export default async function DashboardPage() {
  const session = await getSession();
  const firstName = session?.user?.name?.split(" ")[0] || "there";

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-up">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Good to see you, {firstName} 👋
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Here&apos;s what&apos;s happening across your workspace.
        </p>
      </div>

      {/* Hero CTA — What do you want to automate? */}
      <GlassCard className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--brand-light)]">
            <Zap className="h-4 w-4 text-[var(--brand)]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--foreground)]">What do you want to automate?</h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">Describe the task and Flowra will build the workflow for you.</p>
          </div>
        </div>
        <Textarea
          placeholder="e.g. Whenever someone submits my contact form, create a lead and send them a confirmation email..."
          className="mb-3 min-h-[80px] bg-[var(--surface)] resize-none"
        />
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {QUICK_SUGGESTIONS.slice(0, 2).map((s) => (
              <button
                key={s}
                className="text-xs px-3 py-1.5 rounded-[var(--radius-full)] border border-[var(--border-strong)] text-[var(--muted)] hover:border-[var(--brand-border)] hover:text-[var(--brand)] transition-all duration-150 cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
          <Button size="md" asChild>
            <Link href="/dashboard/automations/new">
              Create workflow <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </GlassCard>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Active Workflows" value="24"  trend={{ value: 12 }} icon={Webhook} />
        <StatCard title="Contacts"         value="1,248" trend={{ value: 8 }}  icon={Users} />
        <StatCard title="Forms Published"  value="7"   trend={{ value: 0 }}   icon={FileText} />
      </div>

      {/* Recent activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">Recent Activity</h2>
          <Button variant="ghost" size="sm" className="text-xs" asChild>
            <Link href="/dashboard/automations">View all</Link>
          </Button>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)]">
          {RECENT_ACTIVITY.map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--surface-elevated)] transition-colors duration-100">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-elevated)] border border-[var(--border)]">
                <item.icon className="h-4 w-4 text-[var(--muted)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--foreground)] truncate">{item.label}</p>
                <p className="text-xs text-[var(--muted)] truncate">{item.sub}</p>
              </div>
              <span className="text-xs text-[var(--subtle)] shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
