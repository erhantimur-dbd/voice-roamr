import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { NUMBER_CATALOG } from "@/lib/product";
import { purchaseNumber } from "@/lib/voice/functions";
import { useConsoleInvalidate } from "@/lib/voice/console";
import { formatCents } from "@/lib/utils";
import { useAppConsole } from "./route";

export const Route = createFileRoute("/app/numbers")({
  component: NumbersPage,
});

function NumbersPage() {
  const data = useAppConsole();
  const invalidate = useConsoleInvalidate();
  const owned = new Set(data.numbers.map((n) => n.e164));

  async function buy(e164: string) {
    const res = await purchaseNumber({ data: { e164 } });
    if (res.ok) {
      toast.success("Number is live");
      await invalidate();
    } else toast.error(res.error);
  }

  return (
    <div>
      <h2 className="font-display text-3xl tracking-tight">Local numbers</h2>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Twilio inside Roamr. Pick a city, assign it to an agent, and the line answers. When Twilio keys are connected, purchases hit the live inventory.
      </p>
      <div className="mt-6">
        <h3 className="text-sm uppercase tracking-[0.14em] text-subtle">Your numbers</h3>
        <div className="mt-3 divide-y divide-border surface-card">
          {data.numbers.length === 0 ? <p className="px-5 py-6 text-sm text-muted">None yet.</p> : null}
          {data.numbers.map((n) => (
            <div key={n.id} className="flex items-center justify-between px-5 py-3 text-sm">
              <div>
                <p className="tabular-nums">{n.e164}</p>
                <p className="text-xs text-subtle">
                  {n.locality}, {n.country}
                </p>
              </div>
              <p className="text-muted">{formatCents(n.monthly_cost_cents)} / mo</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {NUMBER_CATALOG.map((n) => (
          <article key={n.e164} className="flex items-center justify-between gap-3 surface-card p-5">
            <div>
              <p className="tabular-nums text-fg">{n.e164}</p>
              <p className="text-xs text-subtle">
                {n.locality} · {n.number_type} · {formatCents(n.monthly_cost_cents)}/mo
              </p>
            </div>
            <Button type="button" size="sm" disabled={owned.has(n.e164)} onClick={() => void buy(n.e164)}>
              {owned.has(n.e164) ? "Owned" : "Buy"}
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
