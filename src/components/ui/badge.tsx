import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "muted",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: "muted" | "primary" | "live" | "warn" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "muted" && "bg-surface text-muted border border-border",
        tone === "primary" && "bg-primary/15 text-primary",
        tone === "live" && "bg-success/15 text-success",
        tone === "warn" && "bg-danger/15 text-danger",
        className,
      )}
      {...props}
    />
  );
}
