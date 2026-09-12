import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { GUARDRAILS, LOCALES, VOICES, VOICE_TYPES } from "@/lib/product";
import { deleteAgent, saveAgent } from "@/lib/voice/functions";
import { useConsoleInvalidate } from "@/lib/voice/console";
import { VoiceDemo } from "@/components/voice/demo";
import { useAppConsole } from "../route";

export const Route = createFileRoute("/app/agents/$id")({
  component: AgentStudio,
});

function parseMap(value: unknown): Record<string, boolean> {
  if (!value) return {};
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as Record<string, boolean>;
    } catch {
      return {};
    }
  }
  if (typeof value === "object") return value as Record<string, boolean>;
  return {};
}

function parseList(value: unknown): string[] {
  if (!value) return [];
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as string[];
    } catch {
      return [];
    }
  }
  if (Array.isArray(value)) return value as string[];
  return [];
}

function AgentStudio() {
  const { id } = Route.useParams();
  const data = useAppConsole();
  const agent = data.agents.find((a) => a.id === id);
  const invalidate = useConsoleInvalidate();
  const navigate = useNavigate();

  const initialGuard = useMemo(() => parseMap(agent?.guardrails), [agent]);
  const initialTools = useMemo(() => parseList(agent?.tools), [agent]);

  const [name, setName] = useState(agent?.name ?? "");
  const [role, setRole] = useState(agent?.role ?? "assistant");
  const [voiceId, setVoiceId] = useState(agent?.voice_id ?? "eve");
  const [voiceType, setVoiceType] = useState(agent?.voice_type ?? "warm");
  const [language, setLanguage] = useState(agent?.language ?? "en");
  const [greeting, setGreeting] = useState(agent?.greeting ?? "");
  const [instructions, setInstructions] = useState(agent?.instructions ?? "");
  const [status, setStatus] = useState(agent?.status ?? "draft");
  const [guard, setGuard] = useState<Record<string, boolean>>(initialGuard);
  const [saving, setSaving] = useState(false);

  if (!agent) {
    return (
      <p className="text-sm text-muted">
        Agent not found. <Link to="/app/agents">Back</Link>
      </p>
    );
  }

  async function onSave(nextStatus = status) {
    setSaving(true);
    const res = await saveAgent({
      data: {
        id,
        name,
        role,
        voiceId,
        voiceType,
        language,
        greeting,
        instructions,
        guardrails: guard,
        tools: initialTools,
        status: nextStatus as "draft" | "live" | "paused",
      },
    });
    setSaving(false);
    if (res.ok) {
      setStatus(nextStatus);
      toast.success("Saved");
      await invalidate();
    } else toast.error("Could not save");
  }

  async function onDelete() {
    await deleteAgent({ data: { id } });
    await invalidate();
    void navigate({ to: "/app/agents" });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-3xl tracking-tight">Studio</h2>
          <div className="flex gap-2">
            <Button variant="secondary" type="button" onClick={() => void onSave(status === "live" ? "paused" : "live")}>
              {status === "live" ? "Pause" : "Publish"}
            </Button>
            <Button type="button" disabled={saving} onClick={() => void onSave()}>
              Save
            </Button>
          </div>
        </div>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Agent name" />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs uppercase tracking-[0.14em] text-subtle">
            Role
            <select className="mt-1 h-11 w-full rounded-[12px] border border-border bg-bg-elevated px-3 text-sm" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="assistant">Personal assistant</option>
              <option value="sales">Sales</option>
              <option value="support">Support</option>
              <option value="reception">Reception</option>
              <option value="booking">Appointments</option>
              <option value="collections">Collections</option>
            </select>
          </label>
          <label className="text-xs uppercase tracking-[0.14em] text-subtle">
            Language
            <select className="mt-1 h-11 w-full rounded-[12px] border border-border bg-bg-elevated px-3 text-sm" value={language} onChange={(e) => setLanguage(e.target.value)}>
              {LOCALES.map((l) => (
                <option key={l.code} value={l.tts}>
                  {l.native}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-[0.14em] text-subtle">
            Voice type
            <select className="mt-1 h-11 w-full rounded-[12px] border border-border bg-bg-elevated px-3 text-sm" value={voiceType} onChange={(e) => setVoiceType(e.target.value)}>
              {VOICE_TYPES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-[0.14em] text-subtle">
            Voice
            <select className="mt-1 h-11 w-full rounded-[12px] border border-border bg-bg-elevated px-3 text-sm" value={voiceId} onChange={(e) => setVoiceId(e.target.value)}>
              {VOICES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
              {data.voices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} (custom)
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block text-xs uppercase tracking-[0.14em] text-subtle">
          Greeting
          <Input className="mt-1" value={greeting} onChange={(e) => setGreeting(e.target.value)} />
        </label>
        <label className="block text-xs uppercase tracking-[0.14em] text-subtle">
          Instructions
          <Textarea className="mt-1" value={instructions} onChange={(e) => setInstructions(e.target.value)} />
        </label>
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-subtle">Guardrails</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {GUARDRAILS.map((g) => (
              <label key={g.id} className="flex h-11 items-center gap-3 rounded-[12px] border border-border px-3 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(guard[g.id])}
                  onChange={(e) => setGuard((prev) => ({ ...prev, [g.id]: e.target.checked }))}
                />
                {g.label}
              </label>
            ))}
          </div>
        </div>
        <button type="button" className="text-sm text-danger" onClick={() => void onDelete()}>
          Delete agent
        </button>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-subtle">Test call</p>
        <div className="mt-3">
          <VoiceDemo
            labels={{
              listen: "Play greeting",
              talk: "Talk",
              talking: "Listening…",
              thinking: "Thinking…",
              assistant: "Assistant",
              sales: "Sales",
              support: "Support",
            }}
          />
        </div>
      </div>
    </div>
  );
}
