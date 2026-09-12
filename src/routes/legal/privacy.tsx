import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHero } from "@/components/site/shell";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/legal/privacy")({
  component: () => (
    <SiteShell>
      <PageHero kicker="Legal" title="Privacy policy" />
      <div className="mx-auto max-w-3xl space-y-4 px-4 pb-20 text-sm text-muted">
        <p>Effective 12 September 2026. Controller: Roamr, {SITE.domain}.</p>
        <p>
          We process account data, workspace membership, agent configurations, knowledge documents, call
          transcripts and summaries, phone numbers, invoices, and support tickets. Payment cards are never stored
          by Roamr — checkout runs through Stripe when live keys are present. Voice audio is processed by xAI Grok
          Voice to provide the service.
        </p>
        <p>
          Call recordings and transcripts are scoped to your workspace. You may request access or deletion via{" "}
          {SITE.emails.privacy}.
        </p>
      </div>
    </SiteShell>
  ),
  head: () => ({ meta: [{ title: "Privacy — Roamr" }] }),
});
