import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell, PageHero } from "@/components/site/shell";
import { Button } from "@/components/ui/button";
import { ENTERPRISE, PLANS } from "@/lib/product";
import { useI18n } from "@/lib/locale";
import { formatMoney } from "@/lib/utils";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({ meta: [{ title: "Pricing — Roamr voice agents 24/7" }] }),
});

function PricingPage() {
  const { t } = useI18n();
  const [annual, setAnnual] = useState(false);
  return (
    <SiteShell>
      <PageHero kicker={t("navPricing")} title={t("pricingTitle")} lead={t("pricingLead")} />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className={`h-11 rounded-[4px] px-4 text-sm grain-hover ${annual ? "border border-ink text-muted" : "bg-ink text-paper"}`}
          >
            {t("monthly")}
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className={`h-11 rounded-[4px] px-4 text-sm grain-hover ${annual ? "bg-ink text-paper" : "border border-ink text-muted"}`}
          >
            {t("annual")} · {t("save")}
          </button>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {PLANS.map((p) => {
            const price = annual ? Math.round(p.annual / 12) : p.monthly;
            return (
              <article key={p.id} className={`p-6 ${p.popular ? "surface-ink border border-ink" : "surface-card"}`}>
                <h2 className="font-display text-2xl tracking-tight">{p.name}</h2>
                <p className="mt-4 font-display text-4xl">
                  {formatMoney(price)}
                  <span className={`text-base font-sans ${p.popular ? "text-paper/60" : "text-muted"}`}>{t("perMonth")}</span>
                </p>
                {annual ? <p className={`text-sm ${p.popular ? "text-paper/60" : "text-muted"}`}>{formatMoney(p.annual)} {t("billedAnnual")}</p> : null}
                <p className={`mt-2 text-sm ${p.popular ? "text-paper/70" : "text-muted"}`}>{p.blurb}</p>
                <ul className="mt-6 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <p className={`mt-4 text-xs ${p.popular ? "text-paper/55" : "text-subtle"}`}>Overage {formatMoney(p.overage)} / min</p>
                <Button asChild className="mt-8 w-full" variant={p.popular ? "secondary" : "primary"}>
                  <Link to="/signup">{t("startTrial")}</Link>
                </Button>
              </article>
            );
          })}
        </div>
        <article className="surface-card mt-6 p-6 md:flex md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl tracking-tight">{ENTERPRISE.name}</h2>
            <p className="mt-2 max-w-xl text-sm text-muted">{ENTERPRISE.blurb}</p>
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <a href={`mailto:${SITE.emails.sales}`}>{t("talkSales")}</a>
          </Button>
        </article>
      </div>
    </SiteShell>
  );
}
