import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/product";
import { startCheckout } from "@/lib/voice/functions";
import { useConsoleInvalidate } from "@/lib/voice/console";
import { formatCents, formatMoney } from "@/lib/utils";
import { useAppConsole } from "./route";

export const Route = createFileRoute("/app/billing")({
  component: BillingPage,
});

function BillingPage() {
  const data = useAppConsole();
  const invalidate = useConsoleInvalidate();
  const [interval, setInterval] = useState<"monthly" | "annual">("monthly");
  const [pending, setPending] = useState<string | null>(null);

  async function buy(planId: "starter" | "growth" | "scale") {
    setPending(planId);
    const res = await startCheckout({ data: { planId, interval } });
    setPending(null);
    if (res.ok && "url" in res && res.url) {
      window.location.assign(res.url);
      return;
    }
    if (res.ok) {
      toast.success("Plan updated");
      await invalidate();
    } else toast.error("Checkout failed");
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl tracking-tight">Billing</h2>
        <p className="mt-2 text-sm text-muted">
          Current plan {data.workspace.plan} · {data.workspace.billing_interval} · {data.workspace.subscription_status}
        </p>
      </div>
      <div className="flex gap-2">
        <Button type="button" variant={interval === "monthly" ? "primary" : "secondary"} onClick={() => setInterval("monthly")}>
          Monthly
        </Button>
        <Button type="button" variant={interval === "annual" ? "primary" : "secondary"} onClick={() => setInterval("annual")}>
          Annual · save 20%
        </Button>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {PLANS.map((p) => (
          <article key={p.id} className="surface-card p-5">
            <h3 className="font-display text-2xl">{p.name}</h3>
            <p className="mt-2 font-display text-3xl">{formatMoney(interval === "annual" ? Math.round(p.annual / 12) : p.monthly)}</p>
            <Button
              type="button"
              className="mt-5 w-full"
              disabled={pending === p.id || data.workspace.plan === p.id}
              onClick={() => void buy(p.id)}
            >
              {data.workspace.plan === p.id ? "Current" : pending === p.id ? "Working…" : "Choose"}
            </Button>
          </article>
        ))}
      </div>
      <section>
        <h3 className="font-display text-xl">Invoices</h3>
        <div className="mt-3 divide-y divide-border surface-card">
          {data.invoices.length === 0 ? <p className="px-5 py-6 text-sm text-muted">No invoices yet.</p> : null}
          {data.invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between px-5 py-3 text-sm">
              <div>
                <p>{inv.number}</p>
                <p className="text-xs text-subtle">{inv.description}</p>
              </div>
              <p className="tabular-nums">{formatCents(inv.amount_cents, inv.currency)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
