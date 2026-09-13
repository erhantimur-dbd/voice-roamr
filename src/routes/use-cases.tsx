import { createFileRoute } from "@tanstack/react-router";
import { MarketingCtas, SiteShell, PageHero } from "@/components/site/shell";
import { USE_CASES } from "@/lib/product";
import { useI18n } from "@/lib/locale";

export const Route = createFileRoute("/use-cases")({
  component: UseCasesPage,
  head: () => ({ meta: [{ title: "Use cases — Roamr voice agents 24/7" }] }),
});

function UseCasesPage() {
  const { t } = useI18n();
  return (
    <SiteShell>
      <PageHero kicker={t("navUse")} title="AI receptionist, sales, support — then the rest of the desk." lead="High-value voice work: a front desk, a closer, and a night desk that never clocks out." />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-14 sm:px-6 md:grid-cols-2">
        {USE_CASES.map((u) => (
          <article key={u.id} className="surface-card p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{u.kicker}</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight">{u.name}</h2>
            <p className="mt-2 text-sm text-muted">{u.summary}</p>
            <ul className="mt-5 space-y-2 text-sm">
              {u.bullets.map((b) => (
                <li key={b} className="border-t border-border pt-2">
                  {b}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <MarketingCtas size="md" />
      </div>
    </SiteShell>
  );
}
