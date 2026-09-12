import { createFileRoute } from "@tanstack/react-router";
import { formatCents, formatDate } from "@/lib/utils";
import { useOps } from "./route";

export const Route = createFileRoute("/admin/payments")({
  component: PaymentsPage,
});

function PaymentsPage() {
  const data = useOps();
  return (
    <div>
      <h2 className="font-display text-3xl tracking-tight">Payments</h2>
      <div className="mt-6 divide-y divide-border surface-card">
        {data.invoices.length === 0 ? <p className="px-5 py-8 text-sm text-muted">No invoices yet.</p> : null}
        {data.invoices.map((inv) => (
          <div key={inv.id} className="flex items-center justify-between px-5 py-3 text-sm">
            <div>
              <p>{inv.number}</p>
              <p className="text-xs text-subtle">
                {inv.description} · {formatDate(inv.created_at)}
              </p>
            </div>
            <p className="tabular-nums">
              {formatCents(inv.amount_cents, inv.currency)} · {inv.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
