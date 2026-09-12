import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { INTEGRATIONS } from "@/lib/product";
import { googlePeek, setIntegration } from "@/lib/voice/functions";
import { useConsoleInvalidate } from "@/lib/voice/console";
import { useAppConsole } from "./route";

export const Route = createFileRoute("/app/integrations")({
  component: IntegrationsConsole,
});

function IntegrationsConsole() {
  const data = useAppConsole();
  const invalidate = useConsoleInvalidate();
  const statusFor = (id: string) => data.integrations.find((i) => i.provider === id)?.status ?? "disconnected";

  async function toggle(id: string, connect: boolean) {
    const res = await setIntegration({ data: { provider: id, connect } });
    if (res.ok) {
      toast.success(connect ? "Connected" : "Disconnected");
      await invalidate();
    }
  }

  async function peekGoogle() {
    const res = await googlePeek();
    if (res.ok) toast.success("Google Calendar is reachable");
    else if ("loginRequired" in res && res.loginRequired && res.loginUrl) window.location.assign(res.loginUrl);
    else toast.error("error" in res ? res.error : "Could not read Calendar");
  }

  return (
    <div>
      <h2 className="font-display text-3xl tracking-tight">Integrations</h2>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Google Workspace first. Connect Calendar, Gmail and Drive so the agent can book, draft and cite. Everything else is one toggle away.
      </p>
      <div className="mt-4">
        <Button type="button" variant="secondary" onClick={() => void peekGoogle()}>
          Test Google Calendar
        </Button>
      </div>
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {INTEGRATIONS.map((i) => {
          const status = statusFor(i.id);
          const on = status === "connected";
          return (
            <article key={i.id} className="surface-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-subtle">{i.group}</p>
                  <h3 className="mt-1 font-display text-xl tracking-tight">{i.name}</h3>
                </div>
                <Badge tone={on ? "live" : "muted"}>{on ? "On" : "Off"}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted">{i.blurb}</p>
              <Button type="button" size="sm" className="mt-4" variant={on ? "secondary" : "primary"} onClick={() => void toggle(i.id, !on)}>
                {on ? "Disconnect" : "Connect"}
              </Button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
