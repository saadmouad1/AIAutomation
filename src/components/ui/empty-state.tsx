import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-16 px-8",
      "rounded-[var(--radius-xl)] border border-dashed border-[var(--border-strong)]",
      className
    )}>
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-light)] mb-4">
          <Icon className="h-6 w-6 text-[var(--brand)]" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--muted)] max-w-sm leading-relaxed mb-5">{description}</p>
      )}
      {action && (
        <Button size="sm" asChild={!!action.href}>
          {action.href ? (
            <a href={action.href}>{action.label}</a>
          ) : (
            <button onClick={action.onClick}>{action.label}</button>
          )}
        </Button>
      )}
    </div>
  );
}
