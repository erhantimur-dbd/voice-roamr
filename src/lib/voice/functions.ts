import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { env } from "@/lib/env.server";
import {
  DEFAULT_GUARDRAILS,
  DEMO_SCRIPTS,
  INTEGRATIONS,
  MODEL,
  NUMBER_CATALOG,
  PLANS,
  planById,
  planPrice,
} from "@/lib/product";
import { nid } from "@/lib/utils";
import { grokReply, synthesizeSpeech, transcribeAudio } from "./xai";
import { sendTransactional } from "./email";
import {
  getOrCreateWorkspace,
  isOperator,
  maybeClaimOperator,
  num,
  requireOperator,
  type WorkspaceRow,
} from "./workspace";

const previewCap = new Map<string, { n: number; t: number }>();
function allowPreview(bucket: string, max = 24) {
  const now = Date.now();
  const row = previewCap.get(bucket);
  if (!row || now - row.t > 60 * 60 * 1000) {
    previewCap.set(bucket, { n: 1, t: now });
    return true;
  }
  if (row.n >= max) return false;
  row.n += 1;
  return true;
}

export const speakPreview = createServerFn({ method: "POST" })
  .validator(
    z.object({
      scenario: z.string().optional(),
      text: z.string().max(500).optional(),
      voiceId: z.string().max(40).optional(),
      language: z.string().max(12).optional(),
    }),
  )
  .handler(async ({ data }) => {
    if (!allowPreview("tts")) return { ok: false as const, error: "Demo limit reached — sign in for more." };
    const script = DEMO_SCRIPTS[data.scenario ?? "assistant"] ?? DEMO_SCRIPTS.assistant;
    const text = (data.text?.trim() || script.line).slice(0, 500);
    return synthesizeSpeech({
      text,
      voiceId: data.voiceId || script.voice,
      language: data.language || script.language,
    });
  });

export const talkTurn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      audioBase64: z.string().min(16),
      mime: z.string().max(80).optional(),
      scenario: z.string().optional(),
      voiceId: z.string().max(40).optional(),
      language: z.string().max(12).optional(),
      history: z
        .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(800) }))
        .max(8)
        .optional(),
    }),
  )
  .handler(async ({ data }) => {
    if (!allowPreview("talk", 16)) return { ok: false as const, error: "Demo limit reached — sign in for more." };
    const script = DEMO_SCRIPTS[data.scenario ?? "assistant"] ?? DEMO_SCRIPTS.assistant;
    const heard = await transcribeAudio({ audioBase64: data.audioBase64, mime: data.mime ?? "audio/webm" });
    if (!heard.ok) return heard;
    const reply = await grokReply({
      system: script.prompt,
      history: data.history ?? [],
      user: heard.text,
    });
    if (!reply.ok) return reply;
    const spoken = await synthesizeSpeech({
      text: reply.text,
      voiceId: data.voiceId || script.voice,
      language: data.language || script.language,
    });
    if (!spoken.ok) return { ok: false as const, error: spoken.error, userText: heard.text, replyText: reply.text };
    return {
      ok: true as const,
      userText: heard.text,
      replyText: reply.text,
      audio: spoken.audio,
      mime: spoken.mime,
    };
  });

export const getConsole = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await maybeClaimOperator(context.userId);
    const ws = await getOrCreateWorkspace(context.userId);
    const sql = await getSql();
    const agents = await sql<AgentRow>`
      select id, workspace_id, name, role, status, voice_id, voice_type, language,
             greeting, instructions, phone_number_id, created_at, updated_at,
             coalesce(guardrails::text, '{}') as guardrails,
             coalesce(tools::text, '[]') as tools
      from agents where workspace_id = ${ws.id} order by created_at desc
    `;
    const numbers = await sql<NumberRow>`
      select * from phone_numbers where workspace_id = ${ws.id} order by created_at desc
    `;
    const docs = await sql<DocRow>`
      select id, title, agent_id, created_at, length(content) as chars
      from knowledge_docs where workspace_id = ${ws.id} order by created_at desc
    `;
    const integrations = await sql<IntRow>`
      select id, provider, status, updated_at from integrations where workspace_id = ${ws.id}
    `;
    const calls = await sql<CallRow>`
      select * from calls where workspace_id = ${ws.id} order by started_at desc limit 20
    `;
    const invoices = await sql<InvoiceRow>`
      select * from invoices where workspace_id = ${ws.id} order by created_at desc limit 12
    `;
    const tickets = await sql<TicketRow>`
      select * from support_tickets where workspace_id = ${ws.id} order by created_at desc limit 8
    `;
    const voices = await sql<VoiceRow>`
      select * from custom_voices where workspace_id = ${ws.id} order by created_at desc
    `;
    const usageDays = await sql<{ day: string; minutes: number | string; calls: number | string }>`
      select to_char(started_at, 'YYYY-MM-DD') as day,
             coalesce(sum(minutes_billed), 0) as minutes,
             count(*) as calls
      from calls
      where workspace_id = ${ws.id} and started_at > now() - interval '14 days'
      group by 1 order by 1
    `;
    return {
      workspace: serializeWorkspace(ws),
      operator: await isOperator(context.userId),
      agents,
      numbers,
      docs,
      integrations,
      calls,
      invoices,
      tickets,
      voices,
      usageDays: usageDays.map((d) => ({
        day: d.day,
        minutes: num(d.minutes),
        calls: num(d.calls),
      })),
      catalog: {
        plans: PLANS,
        integrations: INTEGRATIONS,
        numbers: NUMBER_CATALOG,
      },
    };
  });

export const saveWorkspace = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ name: z.string().min(2).max(80), company: z.string().max(80).optional(), locale: z.string().max(8).optional() }))
  .handler(async ({ context, data }) => {
    const ws = await getOrCreateWorkspace(context.userId);
    const sql = await getSql();
    await sql`
      update workspaces set
        name = ${data.name},
        company = ${data.company ?? ws.company},
        locale = ${data.locale ?? ws.locale},
        updated_at = now()
      where id = ${ws.id} and user_id = ${context.userId}
    `;
    return { ok: true as const };
  });

export const saveAgent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.string().optional(),
      name: z.string().min(2).max(80),
      role: z.string().max(40),
      voiceId: z.string().max(40),
      voiceType: z.string().max(40).optional(),
      language: z.string().max(12),
      greeting: z.string().max(400).optional(),
      instructions: z.string().max(8000),
      guardrails: z.record(z.string(), z.boolean()).optional(),
      tools: z.array(z.string()).optional(),
      status: z.enum(["draft", "live", "paused"]).optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const ws = await getOrCreateWorkspace(context.userId);
    const sql = await getSql();
    const id = data.id ?? nid("ag");
    const existing = data.id
      ? await sql<{ id: string }>`select id from agents where id = ${data.id} and workspace_id = ${ws.id} limit 1`
      : [];
    const guard = JSON.stringify(data.guardrails ?? DEFAULT_GUARDRAILS);
    const tools = JSON.stringify(data.tools ?? []);
    if (existing[0]) {
      await sql`
        update agents set
          name = ${data.name}, role = ${data.role}, voice_id = ${data.voiceId},
          voice_type = ${data.voiceType ?? "warm"}, language = ${data.language},
          greeting = ${data.greeting ?? ""}, instructions = ${data.instructions},
          guardrails = ${guard}::jsonb, tools = ${tools}::jsonb,
          status = ${data.status ?? "draft"}, updated_at = now()
        where id = ${id} and workspace_id = ${ws.id}
      `;
    } else {
      await sql`
        insert into agents (
          id, workspace_id, user_id, name, role, status, voice_id, language, model,
          greeting, instructions, guardrails, tools, voice_type
        ) values (
          ${id}, ${ws.id}, ${context.userId}, ${data.name}, ${data.role}, ${data.status ?? "draft"},
          ${data.voiceId}, ${data.language}, ${MODEL}, ${data.greeting ?? ""}, ${data.instructions},
          ${guard}::jsonb, ${tools}::jsonb, ${data.voiceType ?? "warm"}
        )
      `;
    }
    return { ok: true as const, id };
  });

export const deleteAgent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    const ws = await getOrCreateWorkspace(context.userId);
    const sql = await getSql();
    await sql`delete from agents where id = ${data.id} and workspace_id = ${ws.id}`;
    return { ok: true as const };
  });

export const addKnowledge = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      title: z.string().min(2).max(120),
      content: z.string().min(8).max(20000),
      agentId: z.string().optional(),
      sourceUrl: z.string().max(400).optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const ws = await getOrCreateWorkspace(context.userId);
    const sql = await getSql();
    const id = nid("kb");
    await sql`
      insert into knowledge_docs (id, workspace_id, user_id, agent_id, title, content, source_url)
      values (${id}, ${ws.id}, ${context.userId}, ${data.agentId ?? null}, ${data.title}, ${data.content}, ${data.sourceUrl ?? null})
    `;
    return { ok: true as const, id };
  });

export const deleteKnowledge = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    const ws = await getOrCreateWorkspace(context.userId);
    const sql = await getSql();
    await sql`delete from knowledge_docs where id = ${data.id} and workspace_id = ${ws.id}`;
    return { ok: true as const };
  });

export const purchaseNumber = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ e164: z.string().min(6).max(32), agentId: z.string().optional() }))
  .handler(async ({ context, data }) => {
    const ws = await getOrCreateWorkspace(context.userId);
    const offer = NUMBER_CATALOG.find((n) => n.e164 === data.e164);
    if (!offer) return { ok: false as const, error: "Number is no longer available." };
    const sql = await getSql();
    const taken = await sql<{ id: string }>`select id from phone_numbers where e164 = ${offer.e164} limit 1`;
    if (taken[0]) return { ok: false as const, error: "That number was just taken." };
    const id = nid("pn");
    const sid = env("TWILIO_ACCOUNT_SID") ? `PN${id.slice(-16)}` : null;
    await sql`
      insert into phone_numbers (
        id, workspace_id, user_id, e164, country, region, locality, number_type,
        twilio_sid, status, monthly_cost_cents, agent_id
      ) values (
        ${id}, ${ws.id}, ${context.userId}, ${offer.e164}, ${offer.country}, ${offer.region},
        ${offer.locality}, ${offer.number_type}, ${sid}, ${"active"}, ${offer.monthly_cost_cents},
        ${data.agentId ?? null}
      )
    `;
    if (data.agentId) {
      await sql`
        update agents set phone_number_id = ${id}, updated_at = now()
        where id = ${data.agentId} and workspace_id = ${ws.id}
      `;
    }
    if (ws.billing_email) {
      await sendTransactional({
        to: ws.billing_email,
        template: "number_ready",
        workspaceId: ws.id,
        userId: context.userId,
        text: `${offer.e164} in ${offer.locality} is live on your workspace.`,
      }).catch(() => {});
    }
    return { ok: true as const, id };
  });

export const assignNumber = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ numberId: z.string(), agentId: z.string().nullable() }))
  .handler(async ({ context, data }) => {
    const ws = await getOrCreateWorkspace(context.userId);
    const sql = await getSql();
    await sql`
      update phone_numbers set agent_id = ${data.agentId}
      where id = ${data.numberId} and workspace_id = ${ws.id}
    `;
    if (data.agentId) {
      await sql`
        update agents set phone_number_id = ${data.numberId}, updated_at = now()
        where id = ${data.agentId} and workspace_id = ${ws.id}
      `;
    }
    return { ok: true as const };
  });

export const setIntegration = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ provider: z.string().max(40), connect: z.boolean() }))
  .handler(async ({ context, data }) => {
    const ws = await getOrCreateWorkspace(context.userId);
    const sql = await getSql();
    const spec = INTEGRATIONS.find((i) => i.id === data.provider);
    if (!spec) return { ok: false as const, error: "Unknown integration." };
    const status = data.connect ? "connected" : "disconnected";
    const existing = await sql<{ id: string }>`
      select id from integrations where workspace_id = ${ws.id} and provider = ${data.provider} limit 1
    `;
    if (existing[0]) {
      await sql`
        update integrations set status = ${status}, updated_at = now()
        where id = ${existing[0].id}
      `;
    } else {
      await sql`
        insert into integrations (id, workspace_id, user_id, provider, status)
        values (${nid("ig")}, ${ws.id}, ${context.userId}, ${data.provider}, ${status})
      `;
    }
    return { ok: true as const, status };
  });

export const googlePeek = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async () => {
    try {
      const { callTool } = await import("@/lib/app-data/client.server");
      const { ConnectorType, GoogleCalendarTools } = await import("@/lib/app-data");
      const result = await callTool(GoogleCalendarTools.listCalendars, {}, { connectorType: ConnectorType.GoogleCalendar });
      if (!result.ok) {
        return {
          ok: false as const,
          loginRequired: Boolean(result.loginRequired),
          loginUrl: result.loginUrl ?? "",
          pending: Boolean(result.pending),
          error: result.errorMessage ?? "Could not read Calendar.",
        };
      }
      return { ok: true as const, error: "" };
    } catch (err) {
      return {
        ok: false as const,
        loginRequired: false,
        loginUrl: "",
        pending: false,
        error: err instanceof Error ? err.message : "Calendar unavailable.",
      };
    }
  });

export const addCustomVoice = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      name: z.string().min(2).max(40),
      description: z.string().max(200).optional(),
      tone: z.string().max(40).optional(),
      language: z.string().max(12).optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const ws = await getOrCreateWorkspace(context.userId);
    const sql = await getSql();
    const id = nid("cv");
    await sql`
      insert into custom_voices (id, workspace_id, user_id, name, description, tone, language, status)
      values (${id}, ${ws.id}, ${context.userId}, ${data.name}, ${data.description ?? ""}, ${data.tone ?? "warm"}, ${data.language ?? "en"}, ${"ready"})
    `;
    return { ok: true as const, id };
  });

export const startCheckout = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ planId: z.enum(["starter", "growth", "scale"]), interval: z.enum(["monthly", "annual"]) }))
  .handler(async ({ context, data }) => {
    const ws = await getOrCreateWorkspace(context.userId);
    const plan = planById(data.planId);
    const amount = planPrice(data.planId, data.interval);
    const stripeKey = env("STRIPE_SECRET_KEY");
    if (stripeKey) {
      const origin = env("BETTER_AUTH_URL") ?? env("APP_URL") ?? "https://roamr-mobile.vercel.app";
      const params = new URLSearchParams();
      params.set("mode", "subscription");
      params.set("success_url", `${origin}/app/billing?ok=1`);
      params.set("cancel_url", `${origin}/app/billing?ok=0`);
      params.set("client_reference_id", ws.id);
      params.set("line_items[0][quantity]", "1");
      params.set("line_items[0][price_data][currency]", "usd");
      params.set("line_items[0][price_data][product_data][name]", `Roamr ${plan.name} (${data.interval})`);
      params.set("line_items[0][price_data][unit_amount]", String(amount * 100));
      params.set("line_items[0][price_data][recurring][interval]", data.interval === "annual" ? "year" : "month");
      const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      });
      if (res.ok) {
        const body = (await res.json()) as { url?: string };
        if (body.url) return { ok: true as const, url: body.url };
      }
    }
    const sql = await getSql();
    await sql`
      update workspaces set
        plan = ${plan.id},
        billing_interval = ${data.interval},
        subscription_status = ${"active"},
        minutes_included = ${plan.minutes},
        seats = ${plan.seats},
        extra_numbers = ${plan.numbers},
        updated_at = now()
      where id = ${ws.id} and user_id = ${context.userId}
    `;
    const invoiceId = nid("in");
    await sql`
      insert into invoices (
        id, workspace_id, user_id, number, status, kind, description, amount_cents, currency, paid_at
      ) values (
        ${invoiceId}, ${ws.id}, ${context.userId}, ${`INV-${invoiceId.slice(-6).toUpperCase()}`},
        ${"paid"}, ${"subscription"}, ${`${plan.name} ${data.interval}`}, ${amount * 100}, ${"usd"}, now()
      )
    `;
    await sql`
      insert into payment_events (id, workspace_id, user_id, invoice_id, kind, amount_cents, status, note)
      values (${nid("pe")}, ${ws.id}, ${context.userId}, ${invoiceId}, ${"charge"}, ${amount * 100}, ${"paid"}, ${plan.name})
    `;
    return { ok: true as const, applied: true as const };
  });

export const logDemoCall = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      agentId: z.string(),
      transcript: z.string().max(8000),
      summary: z.string().max(400).optional(),
      seconds: z.number().min(1).max(600),
      language: z.string().max(12).optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const ws = await getOrCreateWorkspace(context.userId);
    const sql = await getSql();
    const agent = await sql<{ id: string }>`
      select id from agents where id = ${data.agentId} and workspace_id = ${ws.id} limit 1
    `;
    if (!agent[0]) return { ok: false as const, error: "Agent not found." };
    const minutes = Math.max(0.1, Math.round((data.seconds / 60) * 10) / 10);
    const id = nid("ca");
    await sql`
      insert into calls (
        id, workspace_id, user_id, agent_id, direction, channel, status,
        duration_seconds, minutes_billed, transcript, summary, language, ended_at
      ) values (
        ${id}, ${ws.id}, ${context.userId}, ${data.agentId}, ${"inbound"}, ${"web"}, ${"completed"},
        ${Math.round(data.seconds)}, ${minutes}, ${data.transcript}, ${data.summary ?? null},
        ${data.language ?? "en"}, now()
      )
    `;
    await sql`
      update workspaces set minutes_used = minutes_used + ${minutes}, updated_at = now()
      where id = ${ws.id}
    `;
    await sql`
      insert into usage_events (id, workspace_id, user_id, kind, units)
      values (${nid("ue")}, ${ws.id}, ${context.userId}, ${"minutes"}, ${minutes})
    `;
    return { ok: true as const, id };
  });

export const openTicket = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ subject: z.string().min(4).max(120), body: z.string().min(8).max(4000) }))
  .handler(async ({ context, data }) => {
    const ws = await getOrCreateWorkspace(context.userId);
    const sql = await getSql();
    const id = nid("tk");
    await sql`
      insert into support_tickets (id, workspace_id, user_id, subject, body, status, priority)
      values (${id}, ${ws.id}, ${context.userId}, ${data.subject}, ${data.body}, ${"open"}, ${"normal"})
    `;
    if (ws.billing_email) {
      await sendTransactional({
        to: SITE_SUPPORT_ECHO,
        template: "ticket",
        workspaceId: ws.id,
        userId: context.userId,
        text: `${data.subject}\n\n${data.body}`,
      }).catch(() => {});
    }
    return { ok: true as const, id };
  });

const SITE_SUPPORT_ECHO = "support@roamr.mobile";

export const getOperator = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireOperator(context.userId);
    const sql = await getSql();
    const customers = await sql<WorkspaceRow>`
      select * from workspaces order by created_at desc
    `;
    const invoices = await sql<InvoiceRow>`
      select * from invoices order by created_at desc limit 40
    `;
    const tickets = await sql<TicketRow>`
      select * from support_tickets order by created_at desc limit 40
    `;
    const calls = await sql<{ n: number | string; minutes: number | string }>`
      select count(*) as n, coalesce(sum(minutes_billed), 0) as minutes from calls
    `;
    const agents = await sql<{ n: number | string }>`select count(*) as n from agents`;
    const numbers = await sql<{ n: number | string }>`select count(*) as n from phone_numbers`;
    const trend = await sql<{ day: string; minutes: number | string; calls: number | string }>`
      select to_char(started_at, 'YYYY-MM-DD') as day,
             coalesce(sum(minutes_billed), 0) as minutes,
             count(*) as calls
      from calls
      where started_at > now() - interval '14 days'
      group by 1 order by 1
    `;
    const planMix = customers.reduce<Record<string, number>>((acc, c) => {
      const key = c.plan || "trial";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
    const mrr = customers
      .filter((c) => c.subscription_status === "active" && !c.is_sample)
      .reduce((sum, c) => {
        const p = planById(c.plan);
        const monthly = c.billing_interval === "annual" ? Math.round(p.annual / 12) : p.monthly;
        return sum + monthly;
      }, 0);
    return {
      customers: customers.map(serializeWorkspace),
      invoices,
      tickets,
      mrr,
      totals: {
        customers: customers.filter((c) => !c.is_sample).length,
        agents: num(agents[0]?.n),
        numbers: num(numbers[0]?.n),
        calls: num(calls[0]?.n),
        minutes: num(calls[0]?.minutes),
      },
      trend: trend.map((d) => ({ day: d.day, minutes: num(d.minutes), calls: num(d.calls) })),
      planMix: Object.entries(planMix).map(([name, value]) => ({ name, value })),
    };
  });

export const operatorUpdate = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      workspaceId: z.string(),
      suspended: z.boolean().optional(),
      notes: z.string().max(2000).optional(),
      plan: z.string().max(20).optional(),
      ticketId: z.string().optional(),
      ticketStatus: z.enum(["open", "pending", "closed"]).optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    await requireOperator(context.userId);
    const sql = await getSql();
    if (data.ticketId && data.ticketStatus) {
      await sql`
        update support_tickets set status = ${data.ticketStatus}, updated_at = now()
        where id = ${data.ticketId}
      `;
    }
    if (data.suspended != null || data.notes != null || data.plan) {
      await sql`
        update workspaces set
          suspended = coalesce(${data.suspended ?? null}, suspended),
          notes = coalesce(${data.notes ?? null}, notes),
          plan = coalesce(${data.plan ?? null}, plan),
          updated_at = now()
        where id = ${data.workspaceId}
      `;
    }
    return { ok: true as const };
  });

function serializeWorkspace(ws: WorkspaceRow) {
  return {
    ...ws,
    minutes_used: num(ws.minutes_used),
    minutes_included: num(ws.minutes_included),
    seats: num(ws.seats ?? 1),
  };
}

type AgentRow = {
  id: string;
  workspace_id: string;
  name: string;
  role: string;
  status: string;
  voice_id: string;
  voice_type: string;
  language: string;
  greeting: string | null;
  instructions: string;
  guardrails: string;
  tools: string;
  phone_number_id: string | null;
  created_at: string;
  updated_at: string;
};
type NumberRow = {
  id: string;
  e164: string;
  country: string;
  locality: string;
  number_type: string;
  status: string;
  monthly_cost_cents: number;
  agent_id: string | null;
};
type DocRow = { id: string; title: string; agent_id: string | null; created_at: string; chars: number | string };
type IntRow = { id: string; provider: string; status: string; updated_at: string };
type CallRow = {
  id: string;
  agent_id: string;
  direction: string;
  channel: string;
  status: string;
  duration_seconds: number;
  minutes_billed: number | string;
  transcript: string | null;
  summary: string | null;
  language: string | null;
  started_at: string;
};
type InvoiceRow = {
  id: string;
  number: string;
  status: string;
  kind: string;
  description: string;
  amount_cents: number;
  currency: string;
  paid_at: string | null;
  created_at: string;
  workspace_id: string;
};
type TicketRow = {
  id: string;
  subject: string;
  body: string;
  status: string;
  priority: string;
  created_at: string;
  workspace_id: string | null;
  user_id: string;
};
type VoiceRow = {
  id: string;
  name: string;
  description: string | null;
  tone: string | null;
  language: string;
  status: string;
};
