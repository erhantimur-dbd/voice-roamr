import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHero } from "@/components/site/shell";
import { LOCALES } from "@/lib/product";
import { useI18n } from "@/lib/locale";

export const Route = createFileRoute("/languages")({
  component: LanguagesPage,
  head: () => ({ meta: [{ title: "Languages — Roamr voice agents 24/7" }] }),
});

function LanguagesPage() {
  const { t } = useI18n();
  return (
    <SiteShell>
      <PageHero kicker={t("navLang")} title={t("langsTitle")} lead={t("langsLead")} />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {LOCALES.map((l) => (
            <article key={l.code} className="rounded-[20px] border border-border bg-surface p-5">
              <p className="font-display text-2xl tracking-tight">{l.native}</p>
              <p className="mt-1 text-sm text-muted">{l.name}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.14em] text-subtle">TTS {l.tts}</p>
            </article>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
