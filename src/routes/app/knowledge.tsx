import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { addKnowledge, deleteKnowledge } from "@/lib/voice/functions";
import { useConsoleInvalidate } from "@/lib/voice/console";
import { useAppConsole } from "./route";

export const Route = createFileRoute("/app/knowledge")({
  component: KnowledgePage,
});

function KnowledgePage() {
  const data = useAppConsole();
  const invalidate = useConsoleInvalidate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await addKnowledge({ data: { title, content } });
    if (res.ok) {
      setTitle("");
      setContent("");
      toast.success("Added to the knowledge base");
      await invalidate();
    } else toast.error("Could not save");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-3">
        <h2 className="font-display text-3xl tracking-tight">Knowledge base</h2>
        <p className="text-sm text-muted">Paste policies, FAQs, product sheets. The agent will only answer from what you add here plus the live tools you connect.</p>
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
        <Button type="submit">Add document</Button>
      </form>
      <div className="space-y-3">
        {data.docs.length === 0 ? <p className="text-sm text-muted">No documents yet.</p> : null}
        {data.docs.map((d) => (
          <article key={d.id} className="surface-card p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-xl tracking-tight">{d.title}</h3>
              <button
                type="button"
                className="text-sm text-danger"
                onClick={() => void deleteKnowledge({ data: { id: d.id } }).then(() => invalidate())}
              >
                Remove
              </button>
            </div>
            <p className="mt-1 text-xs text-subtle">{d.chars} characters</p>
          </article>
        ))}
      </div>
    </div>
  );
}
