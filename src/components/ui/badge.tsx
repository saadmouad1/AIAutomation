import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-0.5 text-xs font-medium border transition-colors",
  {
    variants: {
      variant: {
        default:  "bg-[var(--surface-elevated)] text-[var(--foreground)] border-[var(--border-strong)]",
        brand:    "bg-[var(--brand-light)] text-[var(--brand)] border-[var(--brand-border)]",
        success:  "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success-bg)]",
        warning:  "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning-bg)]",
        error:    "bg-[var(--error-bg)] text-[var(--error)] border-[var(--error-bg)]",
        info:     "bg-[var(--info-bg)] text-[var(--info)] border-[var(--info-bg)]",
        outline:  "bg-transparent text-[var(--muted)] border-[var(--border-strong)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
