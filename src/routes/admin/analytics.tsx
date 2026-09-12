import { createFileRoute } from "@tanstack/react-router";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { AreaTrend, Stat } from "@/components/portal/charts";
import { formatMoney, formatNumber } from "@/lib/utils";
import { useOps } from "./route";

const COLORS = ["#0A0A0A", "#52525B", "#A1A1AA", "#E4E4E7"];

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalytics,
});

function AdminAnalytics() {
  const data = useOps();
  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl tracking-tight">Analytics</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="MRR" value={formatMoney(data.mrr)} />
        <Stat label="Agents" value={formatNumber(data.totals.agents)} />
        <Stat label="Calls" value={formatNumber(data.totals.calls)} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface-card p-5">
          <h3 className="font-display text-xl">Minutes</h3>
          <AreaTrend data={data.trend} dataKey="minutes" label="Minutes" />
        </section>
        <section className="surface-card p-5">
          <h3 className="font-display text-xl">Plan mix</h3>
          <div className="h-56">
            {data.planMix.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.planMix} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72}>
                    {data.planMix.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-10 text-center text-sm text-muted">No workspaces yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
