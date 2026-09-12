import { env } from "@/lib/env.server";
import { SITE } from "@/lib/site";
import { getSql } from "@/lib/db";
import { nid } from "@/lib/utils";

type Template = "welcome" | "invoice" | "number_ready" | "ticket" | "plan_change";

const FROM: Record<Template, string> = {
  welcome: SITE.emails.hello,
  invoice: SITE.emails.billing,
  number_ready: SITE.emails.hello,
  ticket: SITE.emails.support,
  plan_change: SITE.emails.billing,
};

const SUBJECT: Record<Template, string> = {
  welcome: "Your Roamr voice workspace is ready",
  invoice: "Your Roamr invoice",
  number_ready: "Your local number is live",
  ticket: "We have your support note",
  plan_change: "Your Roamr plan updated",
};

export async function sendTransactional(input: {
  to: string;
  template: Template;
  workspaceId?: string;
  userId?: string;
  text: string;
}): Promise<void> {
  const sql = await getSql();
  const id = nid("em");
  const key = env("RESEND_API_KEY");
  let status = "queued";
  if (key) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${SITE.name} <${FROM[input.template]}>`,
          to: [input.to],
          subject: SUBJECT[input.template],
          text: input.text,
        }),
      });
      status = res.ok ? "sent" : "failed";
    } catch {
      status = "failed";
    }
  } else {
    status = "logged";
  }
  await sql`
    insert into email_log (id, workspace_id, user_id, to_address, template, status)
    values (
      ${id},
      ${input.workspaceId ?? null},
      ${input.userId ?? null},
      ${input.to},
      ${input.template},
      ${status}
    )
  `;
}
