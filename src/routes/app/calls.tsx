import { createFileRoute } from "@tanstack/react-router";
import { formatDateTime, formatDuration } from "@/lib/utils";
import { useAppConsole } from "./route";

export const Route = createFileRoute("/app/calls")({
  component: CallsPage,
});

function CallsPage() {
  const data = useAppConsole();
  return (
    <div>
      <h2 className="font-display text-3xl tracking-tight">Calls</h2>
      <div className="mt-6 divide-y divide-border overflow-hidden rounded-[20px] border border-border bg-surface">
        {data.calls.length === 0 ? <p className="px-5 py-8 text-sm text-muted">No calls logged yet.</p> : null}
        {data.calls.map((c) => (
          <article key={c.id} className="px-5 py-4">
            <div className="flex items-center justify-between gap-3 text-sm">
              <p className="font-medium">{c.summary || "Web call"}</p>
              <p className="tabular-nums text-muted">{formatDuration(c.duration_seconds)}</p>
            </div>
            <p className="mt-1 text-xs text-subtle">
              {formatDateTime(c.started_at)} · {c.channel} · {c.language || "auto"}
            </p>
            {c.transcript ? <p className="mt-3 whitespace-pre-wrap text-sm text-muted">{c.transcript}</p> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
