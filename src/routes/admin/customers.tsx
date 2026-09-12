import { createFileRoute, Link } from "@tanstack/react-router";
import { formatNumber } from "@/lib/utils";
import { useOps } from "./route";

export const Route = createFileRoute("/admin/customers")({
  component: CustomersPage,
});

function CustomersPage() {
  const data = useOps();
  return (
    <div>
      <h2 className="font-display text-3xl tracking-tight">Customers</h2>
      <div className="mt-6 overflow-x-auto rounded-[20px] border border-border bg-surface">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.14em] text-subtle">
            <tr>
              <th className="px-5 py-3">Workspace</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Minutes</th>
            </tr>
          </thead>
          <tbody>
            {data.customers.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-5 py-3">
                  <Link to="/admin/customers/$id" params={{ id: c.id }} className="text-fg">
                    {c.name}
                  </Link>
                  {c.is_sample ? <span className="ml-2 text-xs text-subtle">sample</span> : null}
                </td>
                <td>{c.plan}</td>
                <td>{c.suspended ? "suspended" : c.subscription_status}</td>
                <td className="tabular-nums">
                  {formatNumber(Math.round(c.minutes_used))} / {c.minutes_included}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
