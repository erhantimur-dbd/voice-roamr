import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { addCustomVoice, openTicket, saveWorkspace } from "@/lib/voice/functions";
import { useConsoleInvalidate } from "@/lib/voice/console";
import { LOCALES } from "@/lib/product";
import { useAppConsole } from "./route";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const data = useAppConsole();
  const invalidate = useConsoleInvalidate();
  const [name, setName] = useState(data.workspace.name);
  const [company, setCompany] = useState(data.workspace.company ?? "");
  const [locale, setLocale] = useState(data.workspace.locale);
  const [voiceName, setVoiceName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  async function onSave(e: FormEvent) {
    e.preventDefault();
    await saveWorkspace({ data: { name, company, locale } });
    toast.success("Workspace saved");
    await invalidate();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <form onSubmit={(e) => void onSave(e)} className="space-y-3">
        <h2 className="font-display text-3xl tracking-tight">Workspace</h2>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
        <Input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
        <select className="h-11 w-full rounded-[12px] border border-border bg-bg-elevated px-3 text-sm" value={locale} onChange={(e) => setLocale(e.target.value)}>
          {LOCALES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.native}
            </option>
          ))}
        </select>
        <Button type="submit">Save</Button>
      </form>
      <div className="space-y-8">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void addCustomVoice({ data: { name: voiceName, language: locale } }).then(async (res) => {
              if (res.ok) {
                setVoiceName("");
                toast.success("Custom voice queued");
                await invalidate();
              }
            });
          }}
        >
          <h3 className="font-display text-2xl tracking-tight">Custom voice</h3>
          <p className="text-sm text-muted">Clone a brand voice from a short sample. Ready voices appear in the studio.</p>
          <Input placeholder="Voice name" value={voiceName} onChange={(e) => setVoiceName(e.target.value)} required />
          <Button type="submit" variant="secondary">
            Create voice
          </Button>
          <ul className="space-y-1 text-sm text-muted">
            {data.voices.map((v) => (
              <li key={v.id}>
                {v.name} · {v.status}
              </li>
            ))}
          </ul>
        </form>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void openTicket({ data: { subject, body } }).then(async (res) => {
              if (res.ok) {
                setSubject("");
                setBody("");
                toast.success("Ticket sent to support@roamr.mobile");
                await invalidate();
              }
            });
          }}
        >
          <h3 className="font-display text-2xl tracking-tight">Support</h3>
          <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          <Textarea placeholder="How can we help?" value={body} onChange={(e) => setBody(e.target.value)} required />
          <Button type="submit" variant="secondary">
            Send to support
          </Button>
        </form>
      </div>
    </div>
  );
}
