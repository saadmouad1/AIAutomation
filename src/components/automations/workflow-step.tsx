import { WorkflowStep } from "@/types/automations";
import { cn } from "@/lib/utils";
import { Zap, CheckCircle2, GitFork, ArrowDown } from "lucide-react";

const STEP_STYLES = {
  trigger:   { bg: "bg-[var(--brand-light)]",   border: "border-[var(--brand-border)]",  text: "text-[var(--brand)]",   icon: Zap },
  action:    { bg: "bg-[var(--surface-elevated)]", border: "border-[var(--border-strong)]", text: "text-[var(--foreground)]", icon: CheckCircle2 },
  condition: { bg: "bg-[var(--warning-bg)]",     border: "border-[var(--warning)]/30",   text: "text-[var(--warning)]", icon: GitFork },
};

interface WorkflowStepCardProps {
  step: WorkflowStep;
  isLast?: boolean;
}

export function WorkflowStepCard({ step, isLast }: WorkflowStepCardProps) {
  const style = STEP_STYLES[step.type];
  const Icon = style.icon;

  return (
    <div className="flex flex-col items-center">
      <div className={cn(
        "w-full max-w-sm rounded-[var(--radius-lg)] border p-4 flex items-center gap-3",
        style.bg, style.border
      )}>
        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)]", style.bg, style.border, "border")}>
          <Icon className={cn("h-4 w-4", style.text)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-semibold leading-tight", style.text)}>{step.name}</p>
          <p className="text-xs text-[var(--muted)] mt-0.5 truncate">{step.description}</p>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] shrink-0">{step.type}</span>
      </div>
      {!isLast && (
        <div className="flex flex-col items-center my-1">
          <div className="w-px h-3 bg-[var(--border-strong)]" />
          <ArrowDown className="h-3 w-3 text-[var(--subtle)]" />
          <div className="w-px h-3 bg-[var(--border-strong)]" />
        </div>
      )}
    </div>
  );
}
