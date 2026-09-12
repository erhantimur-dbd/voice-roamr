import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden="true">
      <rect width="32" height="32" rx="4" fill="#0A0A0A" />
      <path
        d="M8 12c0 0 4-4 8-4s8 4 8 4"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M10 16c0 0 3-3 6-3s6 3 6 3"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M12 20c0 0 2-2 4-2s4 2 4 2"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="16" cy="23.2" r="1.6" fill="#FFFFFF" />
    </svg>
  );
}

export function LogoWord({ className, invert }: { className?: string; invert?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <LogoMark />
      <span className={cn("leading-none", invert ? "text-paper" : "text-fg")}>
        <span className={cn("block font-display text-lg font-semibold tracking-tight", !invert && "letterpress")}>
          Roamr
        </span>
        <span className={cn("block text-[10px] font-medium uppercase tracking-[0.18em]", invert ? "text-paper/60" : "text-muted")}>
          Voice 24/7
        </span>
      </span>
    </span>
  );
}
