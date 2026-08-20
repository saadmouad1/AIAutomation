import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: { value: number; label?: string };
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, trend, icon: Icon, className }: StatCardProps) {
  const positive = trend && trend.value > 0;
  const negative = trend && trend.value < 0;
  const neutral  = trend && trend.value === 0;

  return (
    <div className={cn(
      "rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] p-5",
      "hover:border-[var(--border-strong)] transition-all duration-150",
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">{title}</p>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--brand-light)]">
            <Icon className="h-4 w-4 text-[var(--brand)]" />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-[var(--foreground)] tabular-nums">{value}</p>
      {trend && (
        <div className={cn("flex items-center gap-1 mt-2 text-xs font-medium",
          positive && "text-[var(--success)]",
          negative && "text-[var(--error)]",
          neutral  && "text-[var(--muted)]",
        )}>
          {positive && <TrendingUp className="h-3 w-3" />}
          {negative && <TrendingDown className="h-3 w-3" />}
          {neutral  && <Minus className="h-3 w-3" />}
          <span>{positive && "+"}{trend.value}%{trend.label ? ` ${trend.label}` : " this week"}</span>
        </div>
      )}
    </div>
  );
}
