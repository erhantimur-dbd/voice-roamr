import { createFileRoute } from "@tanstack/react-router";
import { MarketingCtas, SiteShell, PageHero } from "@/components/site/shell";
import { Badge } from "@/components/ui/badge";
import { INTEGRATIONS } from "@/lib/product";
import { useI18n } from "@/lib/locale";

export const Route = createFileRoute("/integrations")({
  component: IntegrationsPage,
  head: () => ({ meta: [{ title: "Integrations — Roamr voice agents 24/7" }] }),
});

function IntegrationsPage() {
  const { t } = useI18n();
  const groups = [...new Set(INTEGRATIONS.map((i) => i.group))];
  return (
    <SiteShell>
      <PageHero kicker={t("navInt")} title={t("intTitle")} lead={t("intLead")} />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {groups.map((g) => (
          <section key={g} className="mb-10">
            <h2 className="font-display text-2xl tracking-tight">{g}</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {INTEGRATIONS.filter((i) => i.group === g).map((i) => (
                <article key={i.id} className="surface-card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl tracking-tight">{i.name}</h3>
                    <Badge tone={i.status === "live" ? "live" : "muted"}>{i.status === "live" ? "Live" : "Coming"}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted">{i.blurb}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
        <MarketingCtas size="md" />
      </div>
    </SiteShell>
  );
}
