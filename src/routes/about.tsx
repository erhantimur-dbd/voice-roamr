import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHero } from "@/components/site/shell";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({ meta: [{ title: "About — Roamr voice agents 24/7" }] }),
});

function AboutPage() {
  return (
    <SiteShell>
      <PageHero
        kicker="About"
        title="Roamr voice agents 24/7"
        lead={SITE.tagline}
      />
      <div className="mx-auto max-w-3xl space-y-5 px-4 py-14 text-base text-muted sm:px-6">
        <p>
          Roamr started as a travel company. The same brief still holds: stay reachable wherever life takes you. The product is now a self-serve voice-agent platform on Grok 2.0 voice — personal assistants, sales floors and support desks that pick up in twenty-five languages.
        </p>
        <p>
          We run the full stack: speech-to-speech, text-to-speech, transcription, knowledge, guardrails, Twilio numbers, and the Google Workspace tools operators already live in.
        </p>
        <p>
          Press: <a className="underline" href={`mailto:${SITE.emails.press}`}>{SITE.emails.press}</a>
        </p>
      </div>
    </SiteShell>
  );
}
