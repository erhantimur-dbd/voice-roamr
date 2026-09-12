import { createFileRoute, Link } from "@tanstack/react-router";
import { AreaTrend, Stat } from "@/components/portal/charts";
import { Button } from "@/components/ui/button";
import { formatDuration, formatNumber } from "@/lib/utils";
import { useAppConsole } from "./route";

export const Route = createFileRoute("/app/")({
  component: Overview,
});

function Overview() {
  const data = useAppConsole();
  const live = data.agents.filter((a) => a.status === "live").length;
  const minutes = data.workspace.minutes_used;
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{data.workspace.name}</p>
          <h2 className="font-display text-3xl tracking-tight">Today’s desk</h2>
        </div>
        <div className="flex gap-2">
          {data.operator ? (
            <Button asChild variant="secondary">
              <Link to="/admin">Operator</Link>
            </Button>
          ) : null}
          <Button asChild>
            <Link to="/app/agents">New agent</Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Minutes used" value={formatNumber(Math.round(minutes))} hint={`${data.workspace.minutes_included} included`} />
        <Stat label="Live agents" value={String(live)} hint={`${data.agents.length} total`} />
        <Stat label="Numbers" value={String(data.numbers.length)} />
        <Stat label="Calls" value={String(data.calls.length)} />
      </div>
      <section className="rounded-[24px] border border-border bg-surface p-5">
        <h3 className="font-display text-xl tracking-tight">Minutes, last 14 days</h3>
        <div className="mt-4">
          <AreaTrend data={data.usageDays} dataKey="minutes" label="Minutes" />
        </div>
      </section>
      <section>
        <h3 className="font-display text-xl tracking-tight">Recent calls</h3>
        <div className="mt-3 divide-y divide-border rounded-[20px] border border-border bg-surface">
          {data.calls.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted">No calls yet. Publish an agent and talk to it from the studio.</p>
          ) : (
            data.calls.slice(0, 8).map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                <div>
                  <p className="text-fg">{c.summary || c.channel}</p>
                  <p className="text-xs text-subtle">{c.language} · {c.status}</p>
                </div>
                <p className="tabular-nums text-muted">{formatDuration(c.duration_seconds)}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
