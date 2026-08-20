import * as React from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number;
}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size = 24, ...props }, ref) => {
    return (
      <Loader2
        ref={ref}
        size={size}
        className={cn("animate-spin text-brand", className)}
        {...props}
      />
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner };
