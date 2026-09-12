import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { OPERATOR_KEY } from "@/lib/voice/operator";
import { operatorUpdate } from "@/lib/voice/functions";
import { formatDateTime } from "@/lib/utils";
import { useOps } from "./route";

export const Route = createFileRoute("/admin/tickets")({
  component: TicketsPage,
});

function TicketsPage() {
  const data = useOps();
  const qc = useQueryClient();
  return (
    <div>
      <h2 className="font-display text-3xl tracking-tight">Tickets</h2>
      <div className="mt-6 space-y-3">
        {data.tickets.length === 0 ? <p className="text-sm text-muted">Inbox is clear.</p> : null}
        {data.tickets.map((t) => (
          <article key={t.id} className="rounded-[20px] border border-border bg-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl">{t.subject}</h3>
                <p className="mt-1 text-xs text-subtle">
                  {t.status} · {formatDateTime(t.created_at)}
                </p>
              </div>
              {t.status !== "closed" ? (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    void operatorUpdate({
                      data: { workspaceId: t.workspace_id ?? "", ticketId: t.id, ticketStatus: "closed" },
                    }).then(() => qc.invalidateQueries({ queryKey: OPERATOR_KEY }))
                  }
                >
                  Close
                </Button>
              ) : null}
            </div>
            <p className="mt-3 text-sm text-muted">{t.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
