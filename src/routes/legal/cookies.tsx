import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHero } from "@/components/site/shell";

export const Route = createFileRoute("/legal/cookies")({
  component: () => (
    <SiteShell>
      <PageHero kicker="Legal" title="Cookie policy" />
      <div className="mx-auto max-w-3xl space-y-4 px-4 pb-20 text-sm text-muted">
        <p>
          We use essential cookies to keep you signed in and to remember a partner referral for 30 days. We do not
          use advertising cookies. Analytics, if enabled later, will be listed here before they run.
        </p>
      </div>
    </SiteShell>
  ),
  head: () => ({ meta: [{ title: "Cookies — Roamr" }] }),
});
