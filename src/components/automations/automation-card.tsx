import { Automation, AutomationStatus } from "@/types/automations";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { Button } from "@/components/ui/button";
import { Webhook, Play } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AutomationCardProps {
  automation: Automation;
}

export function AutomationCard({ automation }: AutomationCardProps) {
  const statusMap: Record<AutomationStatus, Parameters<typeof StatusIndicator>[0]["status"]> = {
    active:  "active",
    paused:  "paused",
    draft:   "draft",
    error:   "error",
  };

  const lastRun = automation.lastRunAt
    ? new Date(automation.lastRunAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    : "Never";

  return (
    <div className="group flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-5 py-4 hover:border-[var(--border-strong)] transition-all duration-150">
      {/* Icon */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--brand-light)]">
        <Webhook className="h-4 w-4 text-[var(--brand)]" />
      </div>
      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link href={`/dashboard/automations/${automation.id}`} className="text-sm font-semibold text-[var(--foreground)] hover:text-[var(--brand)] transition-colors truncate block">
          {automation.name}
        </Link>
        <p className="text-xs text-[var(--muted)] truncate">{automation.description}</p>
      </div>
      {/* Stats */}
      <div className="hidden md:flex items-center gap-6 text-xs text-[var(--muted)] shrink-0">
        <div className="text-right">
          <p className="font-semibold text-[var(--foreground)]">{automation.runCount}</p>
          <p>runs</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-[var(--foreground)]">{automation.steps.length}</p>
          <p>steps</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-[var(--foreground)]">{lastRun}</p>
          <p>last run</p>
        </div>
      </div>
      {/* Status + action */}
      <div className="flex items-center gap-3 shrink-0">
        <StatusIndicator status={statusMap[automation.status]} />
        <Button variant="ghost" size="icon_sm" aria-label="Run automation">
          <Play className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
