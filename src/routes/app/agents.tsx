import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { saveAgent } from "@/lib/voice/functions";
import { useConsoleInvalidate } from "@/lib/voice/console";
import { useAppConsole } from "./route";

export const Route = createFileRoute("/app/agents")({
  component: AgentsPage,
});

function AgentsPage() {
  const data = useAppConsole();
  const invalidate = useConsoleInvalidate();
  const navigate = useNavigate();

  async function create() {
    const res = await saveAgent({
      data: {
        name: "New agent",
        role: "assistant",
        voiceId: "eve",
        voiceType: "assistant",
        language: "en",
        greeting: "Hi, this is your Roamr agent. How can I help?",
        instructions: "You are a helpful voice agent. Be concise and clear.",
        status: "draft",
      },
    });
    if (res.ok) {
      await invalidate();
      void navigate({ to: "/app/agents/$id", params: { id: res.id } });
    } else toast.error("Could not create agent");
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-3xl tracking-tight">Agents</h2>
        <Button type="button" onClick={() => void create()}>
          New agent
        </Button>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {data.agents.map((a) => (
          <Link
            key={a.id}
            to="/app/agents/$id"
            params={{ id: a.id }}
            className="rounded-[20px] border border-border bg-surface p-5 hover:border-border-strong"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-2xl tracking-tight">{a.name}</h3>
              <Badge tone={a.status === "live" ? "live" : "muted"}>{a.status}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted">
              {a.role} · {a.voice_id} · {a.language}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
