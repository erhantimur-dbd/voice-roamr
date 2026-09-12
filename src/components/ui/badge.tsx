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
        tone === "primary" && "bg-ink text-paper",
        tone === "live" && "border border-ink text-ink",
        tone === "warn" && "border border-zinc-400 text-muted",
        className,
      )}
      {...props}
    />
  );
}
