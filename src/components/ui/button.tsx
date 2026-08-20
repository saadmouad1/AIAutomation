import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "transition-all duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
    "disabled:pointer-events-none disabled:opacity-40",
    "select-none cursor-pointer",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-[var(--brand)] text-white border border-transparent",
          "hover:bg-[var(--brand-hover)] active:scale-[0.98]",
          "shadow-[0_1px_3px_rgba(0,0,0,0.3)]",
        ],
        secondary: [
          "bg-[var(--surface-elevated)] text-[var(--foreground)] border border-[var(--border-strong)]",
          "hover:bg-[var(--surface-overlay)] active:scale-[0.98]",
        ],
        ghost: [
          "bg-transparent text-[var(--muted)] border border-transparent",
          "hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)] active:scale-[0.98]",
        ],
        danger: [
          "bg-[var(--error)] text-white border border-transparent",
          "hover:opacity-90 active:scale-[0.98]",
        ],
        outline: [
          "bg-transparent text-[var(--foreground)] border border-[var(--border-strong)]",
          "hover:bg-[var(--surface-elevated)] active:scale-[0.98]",
        ],
        brand_outline: [
          "bg-[var(--brand-light)] text-[var(--brand)] border border-[var(--brand-border)]",
          "hover:bg-[var(--brand-light)] hover:border-[var(--brand)] active:scale-[0.98]",
        ],
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-[var(--radius-sm)]",
        md: "h-9 px-4 text-sm rounded-[var(--radius-md)]",
        lg: "h-10 px-5 text-sm rounded-[var(--radius-md)]",
        xl: "h-12 px-6 text-base rounded-[var(--radius-lg)]",
        icon: "h-9 w-9 rounded-[var(--radius-md)]",
        icon_sm: "h-7 w-7 rounded-[var(--radius-sm)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
