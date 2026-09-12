import { createFileRoute, Link } from "@tanstack/react-router";
import { AreaTrend, Stat } from "@/components/portal/charts";
import { formatMoney, formatNumber } from "@/lib/utils";
import { useOps } from "./route";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const data = useOps();
  return (
    <div className="space-y-8">
      <h2 className="font-display text-3xl tracking-tight">Platform</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="MRR" value={formatMoney(data.mrr)} />
        <Stat label="Customers" value={formatNumber(data.totals.customers)} />
        <Stat label="Minutes" value={formatNumber(Math.round(data.totals.minutes))} />
        <Stat label="Live numbers" value={formatNumber(data.totals.numbers)} />
      </div>
      <section className="surface-card p-5">
        <h3 className="font-display text-xl">Minutes</h3>
        <AreaTrend data={data.trend} dataKey="minutes" label="Minutes" />
      </section>
      <section>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl">Workspaces</h3>
          <Link to="/admin/customers" className="text-sm text-muted">
            All
          </Link>
        </div>
        <div className="mt-3 divide-y divide-border surface-card">
          {data.customers.slice(0, 8).map((c) => (
            <Link key={c.id} to="/admin/customers/$id" params={{ id: c.id }} className="flex items-center justify-between px-5 py-3 text-sm hover:bg-bg">
              <span>{c.name}</span>
              <span className="text-muted">
                {c.plan} · {c.subscription_status}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
