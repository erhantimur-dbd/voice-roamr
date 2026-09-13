import { getSql } from "@/lib/db";
import { nid, slugify } from "@/lib/utils";
import { PLANS, DEFAULT_GUARDRAILS, MODEL } from "@/lib/product";
import { sendTransactional } from "./email";

export type WorkspaceRow = {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  plan: string;
  billing_interval: string;
  subscription_status: string;
  minutes_included: number;
  minutes_used: number | string;
  extra_numbers: number;
  locale: string;
  company: string | null;
  billing_email: string | null;
  notes: string | null;
  suspended: boolean;
  is_sample: boolean;
  seats: number;
  created_at: string;
};

export async function maybeClaimOperator(userId: string) {
  const sql = await getSql();
  const existing = await sql<{ user_id: string }>`select user_id from platform_admins limit 1`;
  if (existing[0]) return;
  await sql`insert into platform_admins (user_id, role) values (${userId}, ${"owner"}) on conflict do nothing`;
  await seedSamples();
}

export async function isOperator(userId: string): Promise<boolean> {
  const sql = await getSql();
  const rows = await sql<{ user_id: string }>`
    select user_id from platform_admins where user_id = ${userId} limit 1
  `;
  return Boolean(rows[0]);
}

export async function requireOperator(userId: string) {
  await maybeClaimOperator(userId);
  if (!(await isOperator(userId))) {
    throw new Error("Operator access required");
  }
}

async function seedSamples() {
  const sql = await getSql();
  const already = await sql<{ id: string }>`select id from workspaces where is_sample = true limit 1`;
  if (already[0]) return;

  const samples = [
    { name: "Atlas Freight", plan: "scale", minutes: 1840, locale: "en" },
    { name: "Solara Hotels", plan: "growth", minutes: 612, locale: "es" },
    { name: "Northwind Sales", plan: "growth", minutes: 901, locale: "en" },
    { name: "Koma Support", plan: "starter", minutes: 74, locale: "ja" },
  ];
  for (const s of samples) {
    const spec = PLANS.find((p) => p.id === s.plan) ?? PLANS[1];
    const id = nid("ws");
    const userId = `sample-${slugify(s.name)}`;
    await sql`
      insert into workspaces (
        id, user_id, name, slug, plan, billing_interval, subscription_status,
        minutes_included, minutes_used, locale, company, is_sample, seats
      ) values (
        ${id}, ${userId}, ${s.name}, ${slugify(s.name)}, ${s.plan}, ${"monthly"},
        ${"active"}, ${spec.minutes}, ${s.minutes}, ${s.locale}, ${s.name}, ${true}, ${spec.seats}
      )
    `;
  }
}

export async function getOrCreateWorkspace(userId: string, email?: string | null): Promise<WorkspaceRow> {
  const sql = await getSql();
  const existing = await sql<WorkspaceRow>`
    select * from workspaces where user_id = ${userId} limit 1
  `;
  if (existing[0]) return existing[0];

  const id = nid("ws");
  const name = email?.split("@")[0] ? `${email.split("@")[0]} workspace` : "My workspace";
  const trialEnds = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const starter = PLANS[0];
  await sql`
    insert into workspaces (
      id, user_id, name, slug, plan, billing_interval, subscription_status,
      trial_ends_at, minutes_included, locale, billing_email, seats
    ) values (
      ${id}, ${userId}, ${name}, ${slugify(name) || id}, ${"trial"}, ${"monthly"},
      ${"trialing"}, ${trialEnds}, ${50}, ${"en"}, ${email ?? null}, ${1}
    )
  `;
  await sql`
    insert into agents (
      id, workspace_id, user_id, name, role, status, voice_id, language, model,
      greeting, instructions, personality, guardrails, tools, voice_type
    ) values (
      ${nid("ag")}, ${id}, ${userId}, ${"Personal assistant"}, ${"assistant"}, ${"draft"},
      ${"eve"}, ${"en"}, ${MODEL},
      ${"Hi, this is your Roamr assistant. How can I help?"},
      ${"You are a private personal assistant. Be concise, warm, and specific. Help with calendar, travel, and follow-ups."},
      ${"warm"}, ${JSON.stringify(DEFAULT_GUARDRAILS)}, ${JSON.stringify(["gcal", "gmail"])},
      ${"assistant"}
    )
  `;
  if (email) {
    await sendTransactional({
      to: email,
      template: "welcome",
      workspaceId: id,
      userId,
      text: `Welcome to ${name}. Open the console to publish your first agent on Grok 2.0 voice.`,
    }).catch(() => {});
  }
  const created = await sql<WorkspaceRow>`select * from workspaces where id = ${id} limit 1`;
  return created[0];
}

export function num(v: number | string | null | undefined): number {
  if (typeof v === "number") return v;
  if (v == null) return 0;
  const n = Number.parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
}
