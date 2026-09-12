import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell, PageHero } from "@/components/site/shell";
import { Button } from "@/components/ui/button";
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
                  <h3 className="font-display text-xl tracking-tight">{i.name}</h3>
                  <p className="mt-1 text-sm text-muted">{i.blurb}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
        <Button asChild>
          <Link to="/signup">{t("start")}</Link>
        </Button>
      </div>
    </SiteShell>
  );
}
