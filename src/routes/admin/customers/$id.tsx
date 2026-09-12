import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { OPERATOR_KEY } from "@/lib/voice/operator";
import { operatorUpdate } from "@/lib/voice/functions";
import { formatNumber } from "@/lib/utils";
import { useOps } from "../route";

export const Route = createFileRoute("/admin/customers/$id")({
  component: CustomerDetail,
});

function CustomerDetail() {
  const { id } = Route.useParams();
  const data = useOps();
  const qc = useQueryClient();
  const c = data.customers.find((x) => x.id === id);
  if (!c) return <p className="text-sm text-muted">Unknown workspace.</p>;

  async function patch(payload: { suspended?: boolean; plan?: string }) {
    await operatorUpdate({ data: { workspaceId: id, ...payload } });
    toast.success("Updated");
    await qc.invalidateQueries({ queryKey: OPERATOR_KEY });
  }

  return (
    <div className="space-y-6">
      <Link to="/admin/customers" className="text-sm text-muted">
        All customers
      </Link>
      <h2 className="font-display text-3xl tracking-tight">{c.name}</h2>
      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[16px] border border-border p-4">
          <dt className="text-xs uppercase tracking-[0.14em] text-subtle">Plan</dt>
          <dd className="mt-1">{c.plan}</dd>
        </div>
        <div className="rounded-[16px] border border-border p-4">
          <dt className="text-xs uppercase tracking-[0.14em] text-subtle">Status</dt>
          <dd className="mt-1">{c.suspended ? "suspended" : c.subscription_status}</dd>
        </div>
        <div className="rounded-[16px] border border-border p-4">
          <dt className="text-xs uppercase tracking-[0.14em] text-subtle">Minutes</dt>
          <dd className="mt-1 tabular-nums">
            {formatNumber(Math.round(c.minutes_used))} / {c.minutes_included}
          </dd>
        </div>
        <div className="rounded-[16px] border border-border p-4">
          <dt className="text-xs uppercase tracking-[0.14em] text-subtle">Locale</dt>
          <dd className="mt-1">{c.locale}</dd>
        </div>
      </dl>
      <div className="flex gap-2">
        <Button type="button" variant="secondary" onClick={() => void patch({ suspended: !c.suspended })}>
          {c.suspended ? "Reinstate" : "Suspend"}
        </Button>
      </div>
    </div>
  );
}
