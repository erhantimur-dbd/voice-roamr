import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHero } from "@/components/site/shell";
import { GUARDRAILS } from "@/lib/product";
import { useI18n } from "@/lib/locale";

export const Route = createFileRoute("/security")({
  component: SecurityPage,
  head: () => ({ meta: [{ title: "Guardrails — Roamr voice agents 24/7" }] }),
});

function SecurityPage() {
  const { t } = useI18n();
  return (
    <SiteShell>
      <PageHero kicker="Security" title={t("guardTitle")} lead={t("guardLead")} />
      <div className="mx-auto grid max-w-6xl gap-3 px-4 py-14 sm:px-6 md:grid-cols-2">
        {GUARDRAILS.map((g) => (
          <article key={g.id} className="surface-card p-5">
            <h2 className="font-display text-xl tracking-tight">{g.label}</h2>
            <p className="mt-2 text-sm text-muted">{g.hint}</p>
          </article>
        ))}
      </div>
    </SiteShell>
  );
}
