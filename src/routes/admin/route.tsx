import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, LayoutGrid, LifeBuoy, Users, Wallet } from "lucide-react";
import { createContext, useContext } from "react";
import { PortalShell } from "@/components/portal/shell";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { type OperatorData, useOperator } from "@/lib/voice/operator";

const Ctx = createContext<OperatorData | null>(null);

export function useOps() {
  const v = useContext(Ctx);
  if (!v) throw new Error("Operator data missing");
  return v;
}

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({ meta: [{ title: "Operator — Roamr" }] }),
});

function AdminLayout() {
  const q = useOperator();
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
          <p className="font-display text-2xl tracking-tight">Operator access required</p>
          <p className="mt-2 text-sm text-muted">
            The first teammate to sign in becomes the owner. If this desk already has one, ask them to add you.
          </p>
        </div>
      </div>
    );
  }
  return (
    <Ctx.Provider value={q.data}>
      <PortalShell
        title="Operator"
        badge="Admin"
        homeTo="/app"
        items={[
          { to: "/admin", label: "Dashboard", icon: <LayoutGrid className="size-4" /> },
          { to: "/admin/customers", label: "Customers", icon: <Users className="size-4" /> },
          { to: "/admin/payments", label: "Payments", icon: <Wallet className="size-4" /> },
          { to: "/admin/analytics", label: "Analytics", icon: <BarChart3 className="size-4" /> },
          { to: "/admin/tickets", label: "Tickets", icon: <LifeBuoy className="size-4" /> },
        ]}
      />
    </Ctx.Provider>
  );
}
