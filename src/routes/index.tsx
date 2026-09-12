import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Globe2, PhoneCall, ShieldCheck } from "lucide-react";
import { SiteShell } from "@/components/site/shell";
import { VoiceDemo } from "@/components/voice/demo";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/locale";
import { GUARDRAILS, INTEGRATIONS, LOCALES, PLANS, USE_CASES } from "@/lib/product";
import { formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Home,
});

const HERO = {
  eyebrow: "AI voice agent · real phone number",
  title: "Keep your business going 24/7 — never miss an opportunity.",
  sub: "Roamr answers on your number, books or escalates to you, in the languages your customers speak.",
} as const;

const HERO_ADDON = "Give each agent a real local number in the markets you sell into.";

const PROOF = [
  "Real phone number — not a chat widget",
  "Multilingual, 24/7",
  "Answer · book · escalate",
  "Global numbers for your voice agents — get a local number where your customers are.",
] as const;

const DID_CHROME = "Local numbers where your customers are — not chat widgets.";

function Home() {
  const { t } = useI18n();
  return (
    <SiteShell>
      <section className="border-b border-border bg-bg">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-medium tracking-[0.04em] text-subtle">{HERO.eyebrow}</p>
            <h1 className="rule-double mt-4 font-display text-4xl tracking-tight sm:text-6xl">{HERO.title}</h1>
            <p className="mt-5 max-w-xl text-base text-muted sm:text-lg">{HERO.sub}</p>
            <p className="mt-3 max-w-xl text-sm text-muted">{HERO_ADDON}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/signup">{t("start")}</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <a href="#demo">{t("demo")}</a>
              </Button>
            </div>
            <p className="mt-10 max-w-2xl text-[11px] font-medium tracking-[0.04em] text-muted">
              {PROOF.map((item, i) => (
                <span key={item}>
                  {i > 0 ? (
                    <span aria-hidden="true" className="text-zinc-400">
                      {" "}
                      ·{" "}
                    </span>
                  ) : null}
                  {item}
                </span>
              ))}
            </p>
          </div>
          <div id="demo" className="relative">
            <div className="hero-hatch absolute -inset-3 -z-10 sm:-inset-5" aria-hidden="true" />
            <VoiceDemo
              labels={{
                listen: t("listen"),
                talk: t("talk"),
                talking: t("talking"),
                thinking: t("thinking"),
                assistant: t("assistant"),
                sales: t("sales"),
                support: t("support"),
              }}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 sm:px-6">
          <p className="text-[11px] font-medium tracking-[0.04em] text-fg">{DID_CHROME}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
            <span className="text-subtle">Stack</span>
            <span>Grok 2.0</span>
            <span aria-hidden="true" className="text-zinc-400">
              ·
            </span>
            <span>Twilio</span>
            <span aria-hidden="true" className="text-zinc-400">
              ·
            </span>
            <span>Google Workspace</span>
            <span aria-hidden="true" className="text-zinc-400">
              ·
            </span>
            <span>{LOCALES.length} languages</span>
            <span aria-hidden="true" className="text-zinc-400">
              ·
            </span>
            <span>Global numbers</span>
          </div>
        </div>
      </section>

      <section id="product" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-subtle">{t("how")}</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl tracking-tight sm:text-4xl">
          Live on a local number before lunch.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { t: t("how1t"), d: t("how1"), icon: Globe2 },
            { t: t("how2t"), d: t("how2"), icon: ShieldCheck },
            { t: t("how3t"), d: t("how3"), icon: PhoneCall },
          ].map((step, i) => (
            <article key={step.t} className="surface-card p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-subtle">0{i + 1}</p>
              <step.icon className="mt-4 size-5 text-ink" />
              <h3 className="mt-4 font-display text-2xl tracking-tight">{step.t}</h3>
              <p className="mt-2 text-sm text-muted">{step.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-zinc">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-subtle">{t("navUse")}</p>
              <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">Built for the calls that pay.</h2>
            </div>
            <Link to="/use-cases" className="hidden items-center gap-1 text-sm text-muted hover:text-fg sm:inline-flex">
              All use cases <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {USE_CASES.slice(0, 3).map((u) => (
              <article key={u.id} className="surface-card p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-muted">{u.kicker}</p>
                <h3 className="mt-3 font-display text-2xl tracking-tight">{u.name}</h3>
                <p className="mt-2 text-sm text-muted">{u.summary}</p>
                <ul className="mt-4 space-y-2 text-sm text-fg">
                  {u.bullets.map((b) => (
                    <li key={b} className="border-t border-border pt-2">
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-subtle">{t("navLang")}</p>
        <h2 className="mt-3 font-display text-3xl tracking-tight">{t("langsTitle")}</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">{t("langsLead")}</p>
        <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {LOCALES.map((l) => (
            <div key={l.code} className="surface-card px-3 py-3">
              <p className="text-sm text-fg">{l.native}</p>
              <p className="text-xs text-subtle">{l.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-zinc">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-subtle">{t("navInt")}</p>
          <h2 className="mt-3 font-display text-3xl tracking-tight">{t("intTitle")}</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted">{t("intLead")}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {INTEGRATIONS.filter((i) => i.group === "Google").map((i) => (
              <article key={i.id} className="surface-card p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-muted">{i.group}</p>
                <h3 className="mt-2 font-display text-xl tracking-tight">{i.name}</h3>
                <p className="mt-1 text-sm text-muted">{i.blurb}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">
            Also: {INTEGRATIONS.filter((i) => i.group !== "Google")
              .map((i) => i.name)
              .join(", ")}
            .
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-subtle">{t("navPricing")}</p>
        <h2 className="mt-3 font-display text-3xl tracking-tight">{t("pricingTitle")}</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">{t("pricingLead")}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-subtle">{t("monthly")}</p>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {PLANS.map((p) => (
            <article
              key={p.id}
              className={`p-6 ${p.popular ? "surface-ink border border-ink" : "surface-card"}`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-2xl tracking-tight">{p.name}</h3>
                {"popular" in p && p.popular ? (
                  <span className="text-xs uppercase tracking-[0.14em] text-paper/60">{t("popular")}</span>
                ) : null}
              </div>
              <p className={`mt-4 font-display text-4xl tracking-tight ${p.popular ? "text-paper" : "text-fg"}`}>
                {formatMoney(p.monthly)}
                <span className={`text-base font-sans ${p.popular ? "text-paper/60" : "text-muted"}`}>{t("perMonth")}</span>
              </p>
              <p className={`mt-1 text-sm ${p.popular ? "text-paper/65" : "text-muted"}`}>{p.blurb}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className={p.popular ? "text-paper/85" : "text-fg"}>
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8 w-full" variant={p.popular ? "secondary" : "primary"}>
                <Link to="/signup">{t("startTrial")}</Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-ink border-t border-ink">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl tracking-tight">{t("guardTitle")}</h2>
          <p className="mt-3 max-w-xl text-sm text-paper/65">{t("guardLead")}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {GUARDRAILS.map((g) => (
              <div key={g.id} className="border border-paper/15 px-4 py-4">
                <p className="text-sm text-paper">{g.label}</p>
                <p className="mt-1 text-xs text-paper/55">{g.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
