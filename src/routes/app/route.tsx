import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  Bot,
  CreditCard,
  LayoutGrid,
  Phone,
  PhoneCall,
  Plug,
  Settings,
} from "lucide-react";
import { createContext, useContext } from "react";
import { PortalShell } from "@/components/portal/shell";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { type ConsoleData, useConsole } from "@/lib/voice/console";

const ConsoleContext = createContext<ConsoleData | null>(null);

export function useAppConsole() {
  const value = useContext(ConsoleContext);
  if (!value) throw new Error("Console missing");
  return value;
}

export const Route = createFileRoute("/app")({
  component: AppLayout,
  head: () => ({ meta: [{ title: "Console — Roamr" }] }),
});

function AppLayout() {
  const q = useConsole();
  if (q.sessionPending || (q.user && q.isPending)) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg">
        <div className="h-10 w-40 animate-pulse rounded-[12px] bg-border" />
      </div>
    );
  }
  if (!q.user) return <RedirectToSignIn />;
  if (q.error || !q.data) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg px-6 text-center">
        <div>
          <p className="font-display text-2xl">Could not open the workspace</p>
          <p className="mt-2 text-sm text-muted">{q.error instanceof Error ? q.error.message : "Try again in a moment."}</p>
          <Link to="/" className="mt-4 inline-block text-sm underline">
            Home
          </Link>
        </div>
      </div>
    );
  }
  return (
    <ConsoleContext.Provider value={q.data}>
      <PortalShell
        title="Console"
        badge={q.data.workspace.plan}
        items={[
          { to: "/app", label: "Overview", icon: <LayoutGrid className="size-4" /> },
          { to: "/app/agents", label: "Agents", icon: <Bot className="size-4" /> },
          { to: "/app/knowledge", label: "Knowledge", icon: <BookOpen className="size-4" /> },
          { to: "/app/numbers", label: "Numbers", icon: <Phone className="size-4" /> },
          { to: "/app/integrations", label: "Integrations", icon: <Plug className="size-4" /> },
          { to: "/app/calls", label: "Calls", icon: <PhoneCall className="size-4" /> },
          { to: "/app/analytics", label: "Analytics", icon: <BarChart3 className="size-4" /> },
          { to: "/app/billing", label: "Billing", icon: <CreditCard className="size-4" /> },
          { to: "/app/settings", label: "Settings", icon: <Settings className="size-4" /> },
        ]}
      />
    </ConsoleContext.Provider>
  );
}
