import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { LogoWord } from "@/components/logo";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { UserButton } from "@/lib/auth/gates";
import { cn } from "@/lib/utils";

export type NavItem = { to: string; label: string; icon: ReactNode };

export function PortalShell({
  title,
  items,
  badge,
  homeTo = "/",
}: {
  title: string;
  items: NavItem[];
  badge?: string;
  homeTo?: string;
}) {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  if (isPending) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg">
        <div className="h-10 w-40 animate-pulse rounded-[12px] bg-border" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  const nav = (
    <nav className="flex flex-col gap-1 px-3">
      {items.map((item) => {
        const active = pathname === item.to || (item.to !== items[0]?.to && pathname.startsWith(item.to));
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={cn(
              "flex h-11 items-center gap-3 rounded-[12px] px-3 text-sm transition-colors",
              active ? "bg-ink text-bg" : "text-muted hover:bg-bg hover:text-fg",
            )}
          >
            <span className="grid size-5 place-items-center">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-bg text-fg md:grid md:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-border bg-surface md:flex md:flex-col">
        <div className="flex items-center justify-between px-5 py-5">
          <Link to={homeTo}>
            <LogoWord />
          </Link>
          {badge ? (
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-muted">
              {badge}
            </span>
          ) : null}
        </div>
        <div className="flex-1">{nav}</div>
        <div className="border-t border-border p-4">
          <UserButton />
        </div>
      </aside>
      <div className="flex min-w-0 flex-col">
        <header className="flex h-16 items-center justify-between gap-3 border-b border-border bg-surface px-4 md:h-[4.25rem] md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="grid size-11 place-items-center rounded-[12px] md:hidden"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <h1 className="font-display text-xl tracking-tight">{title}</h1>
          </div>
          <div className="md:hidden">
            <UserButton />
          </div>
        </header>
        {open ? (
          <div className="border-b border-border bg-surface py-3 md:hidden">{nav}</div>
        ) : null}
        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
