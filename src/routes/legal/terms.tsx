import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHero } from "@/components/site/shell";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/legal/terms")({
  component: () => (
    <SiteShell>
      <PageHero kicker="Legal" title="Terms of service" />
      <div className="mx-auto max-w-3xl space-y-4 px-4 pb-20 text-sm text-muted">
        <p>
          Roamr provides a self-serve Grok voice-agent platform. Plans are billed monthly or annually in USD.
          Minutes and numbers are metered as shown at checkout. You are responsible for lawful use of outbound
          calling in each country you purchase a number for.
        </p>
        <p>
          Guardrails reduce risk; they do not replace your own compliance review. Questions: {SITE.emails.hello}.
        </p>
      </div>
    </SiteShell>
  ),
  head: () => ({ meta: [{ title: "Terms — Roamr" }] }),
});
