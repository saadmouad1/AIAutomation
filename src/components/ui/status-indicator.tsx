import * as React from "react";
import { cn } from "@/lib/utils";

type StatusType = "active" | "paused" | "error" | "pending" | "draft";

const STATUS_STYLES: Record<StatusType, { dot: string; label: string; text: string }> = {
  active:  { dot: "bg-[var(--success)]",  label: "Active",  text: "text-[var(--success)]" },
  paused:  { dot: "bg-[var(--warning)]",  label: "Paused",  text: "text-[var(--warning)]" },
  error:   { dot: "bg-[var(--error)]",    label: "Error",   text: "text-[var(--error)]" },
  pending: { dot: "bg-[var(--info)]",     label: "Pending", text: "text-[var(--info)]" },
  draft:   { dot: "bg-[var(--muted)]",    label: "Draft",   text: "text-[var(--muted)]" },
};

interface StatusIndicatorProps {
  status: StatusType;
  showLabel?: boolean;
  className?: string;
}

export function StatusIndicator({ status, showLabel = true, className }: StatusIndicatorProps) {
  const s = STATUS_STYLES[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", s.dot,
        status === "active" && "animate-pulse shadow-[0_0_6px_var(--success)]"
      )} />
      {showLabel && <span className={cn("text-xs font-medium", s.text)}>{s.label}</span>}
    </span>
  );
}
