import * as React from "react";
import { cn } from "@/lib/utils";

/* GlassCard — layered glass surface for hero elements */
const GlassCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("glass rounded-[var(--radius-xl)]", className)}
      {...props}
    />
  )
);
GlassCard.displayName = "GlassCard";

const GlassCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pb-0", className)} {...props} />
  )
);
GlassCardHeader.displayName = "GlassCardHeader";

const GlassCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-4", className)} {...props} />
  )
);
GlassCardContent.displayName = "GlassCardContent";

export { GlassCard, GlassCardHeader, GlassCardContent };
