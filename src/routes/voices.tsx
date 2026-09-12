import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHero } from "@/components/site/shell";
import { VOICES, VOICE_TYPES } from "@/lib/product";
import { useI18n } from "@/lib/locale";

export const Route = createFileRoute("/voices")({
  component: VoicesPage,
  head: () => ({ meta: [{ title: "Voices — Roamr voice agents 24/7" }] }),
});

function VoicesPage() {
  const { t } = useI18n();
  return (
    <SiteShell>
      <PageHero kicker={t("navVoices")} title={t("voicesTitle")} lead={t("voicesLead")} />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {VOICE_TYPES.map((v) => (
            <span key={v.id} className="rounded-[4px] border border-border px-3 py-2 text-sm text-muted">
              {v.label}
            </span>
          ))}
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {VOICES.map((v) => (
            <article key={v.id} className="surface-card p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-subtle">{v.type}</p>
              <h2 className="mt-2 font-display text-2xl tracking-tight">{v.name}</h2>
              <p className="mt-2 text-sm text-muted">{v.line}</p>
              <p className="mt-3 text-xs text-muted">Best for {v.best}</p>
            </article>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
