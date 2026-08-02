"use client";

import { useMagnetic } from "@/hooks/useMagnetic";
import { Button, type ButtonProps } from "./button";
import { cn } from "@/lib/utils";

export function MagneticButton({
  className,
  children,
  ...props
}: ButtonProps) {
  const ref = useMagnetic<HTMLButtonElement>(0.4);

  return (
    <Button ref={ref} className={cn("magnetic-btn", className)} {...props}>
      {children}
    </Button>
  );
}
