import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { LogoWord } from "@/components/logo";
import { LocaleSwitch } from "@/components/site/locale-switch";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n } from "@/lib/locale";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  const { t } = useI18n();
  if (isPending) return <div className="h-11 w-24 animate-pulse rounded-[12px] bg-border/70" />;
  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link to="/app" className="hidden text-sm font-medium text-muted hover:text-fg sm:inline">
          {t("console")}
        </Link>
        <UserButton />
      </div>
    );
  }
  return (
    <Link to="/login" className="text-sm font-medium text-muted hover:text-fg">
      {t("signIn")}
    </Link>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t, locale, setLocale } = useI18n();
  const nav = [
    { to: "/#product", label: t("navProduct"), hash: true },
    { to: "/use-cases", label: t("navUse") },
    { to: "/pricing", label: t("navPricing") },
    { to: "/languages", label: t("navLang") },
    { to: "/integrations", label: t("navInt") },
    { to: "/voices", label: t("navVoices") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6">
        <Link to="/" onClick={() => setOpen(false)} aria-label="Roamr home">
          <LogoWord />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((item) =>
            item.hash ? (
              <a key={item.label} href={item.to} className="text-sm text-muted transition-colors hover:text-fg">
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className={cn("text-sm transition-colors hover:text-fg", pathname === item.to ? "text-fg" : "text-muted")}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LocaleSwitch value={locale} onChange={setLocale} />
          </div>
          <div className="hidden sm:block">
            <AuthSlot />
          </div>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/signup">{t("start")}</Link>
          </Button>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-[12px] lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-border bg-bg px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {nav.map((item) =>
              item.hash ? (
                <a key={item.label} href={item.to} className="rounded-[12px] px-3 py-3 text-sm" onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} to={item.to} className="rounded-[12px] px-3 py-3 text-sm" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ),
            )}
            <div className="px-3 py-2">
              <LocaleSwitch value={locale} onChange={setLocale} />
            </div>
            <Link to="/login" className="rounded-[12px] px-3 py-3 text-sm" onClick={() => setOpen(false)}>
              {t("signIn")}
            </Link>
            <Link
              to="/signup"
              className="mt-2 rounded-[4px] bg-ink px-4 py-3 text-center text-sm font-medium text-paper grain-hover"
              onClick={() => setOpen(false)}
            >
              {t("start")}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border bg-bg-elevated">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <LogoWord />
          <p className="mt-4 max-w-sm text-sm text-muted">{t("tagline")}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-subtle">Product</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <Link to="/use-cases">{t("navUse")}</Link>
            <Link to="/pricing">{t("navPricing")}</Link>
            <Link to="/voices">{t("navVoices")}</Link>
            <Link to="/languages">{t("navLang")}</Link>
            <Link to="/integrations">{t("navInt")}</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-subtle">Company</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <Link to="/about">About</Link>
            <Link to="/security">Security</Link>
            <Link to="/contact">Contact</Link>
            <a href={SITE.social.x}>Press</a>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-subtle">Account</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <Link to="/app">{t("console")}</Link>
            <Link to="/app/billing">Billing</Link>
            <Link to="/admin">{t("admin")}</Link>
            <a href={`mailto:${SITE.emails.support}`}>{SITE.emails.support}</a>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © 2026 {SITE.name}. {t("footerRights")}
          </p>
          <div className="flex gap-4">
            <Link to="/legal/privacy">Privacy</Link>
            <Link to="/legal/terms">Terms</Link>
            <Link to="/legal/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-fg">
      <SiteNav />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}

export function PageHero({ kicker, title, lead }: { kicker: string; title: string; lead?: string }) {
  return (
    <section className="surface-ink border-b border-ink">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-paper/60">{kicker}</p>
        <h1 className="rule-double mt-3 max-w-3xl font-display text-4xl tracking-tight sm:text-5xl">{title}</h1>
        {lead ? <p className="mt-4 max-w-2xl text-base text-paper/70">{lead}</p> : null}
      </div>
    </section>
  );
}
