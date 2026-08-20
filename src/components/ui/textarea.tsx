import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex w-full min-h-[80px] rounded-[var(--radius-md)] px-3 py-2.5 text-sm",
          "bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--foreground)]",
          "placeholder:text-[var(--muted)]",
          "resize-none transition-all duration-150",
          "focus:outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-border)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-[var(--error)] focus:border-[var(--error)]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
