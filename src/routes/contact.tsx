import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageHero } from "@/components/site/shell";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({ meta: [{ title: "Contact — Roamr voice agents 24/7" }] }),
});

function ContactPage() {
  const rows = [
    ["Hello", SITE.emails.hello],
    ["Support", SITE.emails.support],
    ["Sales", SITE.emails.sales],
    ["Billing", SITE.emails.billing],
    ["Privacy", SITE.emails.privacy],
    ["Partners", SITE.emails.partners],
  ];
  return (
    <SiteShell>
      <PageHero kicker="Contact" title="A human still answers." lead="Product questions, incidents, partnerships — pick the right desk." />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <ul className="divide-y divide-border rounded-[24px] border border-border bg-surface">
          {rows.map(([label, email]) => (
            <li key={email} className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
              <span className="text-muted">{label}</span>
              <a className="text-fg" href={`mailto:${email}`}>
                {email}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </SiteShell>
  );
}
