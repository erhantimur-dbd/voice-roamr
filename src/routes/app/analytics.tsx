import { createFileRoute } from "@tanstack/react-router";
import { AreaTrend, Stat } from "@/components/portal/charts";
import { formatNumber } from "@/lib/utils";
import { useAppConsole } from "./route";

export const Route = createFileRoute("/app/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const data = useAppConsole();
  const minutes = data.usageDays.reduce((s, d) => s + d.minutes, 0);
  const calls = data.usageDays.reduce((s, d) => s + d.calls, 0);
  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl tracking-tight">Analytics</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Minutes (14d)" value={formatNumber(Math.round(minutes))} />
        <Stat label="Calls (14d)" value={formatNumber(calls)} />
        <Stat
          label="Plan remaining"
          value={`${Math.max(0, data.workspace.minutes_included - data.workspace.minutes_used).toFixed(0)} min`}
        />
      </div>
      <section className="surface-card p-5">
        <h3 className="font-display text-xl">Minutes</h3>
        <AreaTrend data={data.usageDays} dataKey="minutes" label="Minutes" />
      </section>
      <section className="surface-card p-5">
        <h3 className="font-display text-xl">Calls</h3>
        <AreaTrend data={data.usageDays} dataKey="calls" label="Calls" />
      </section>
    </div>
  );
}
