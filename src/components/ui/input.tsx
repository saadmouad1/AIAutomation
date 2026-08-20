import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-[var(--radius-md)] px-3 py-2 text-sm",
          "bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--foreground)]",
          "placeholder:text-[var(--muted)]",
          "transition-all duration-150",
          "focus:outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-border)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error-bg)]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
