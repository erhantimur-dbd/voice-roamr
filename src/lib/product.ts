export const MODEL = "grok-voice-think-fast-2.0" as const;
export const CHAT_MODEL = "grok-4.5" as const;

export const LOCALES = [
  { code: "en", name: "English", native: "English", tts: "en", dir: "ltr" },
  { code: "es", name: "Spanish", native: "Español", tts: "es-ES", dir: "ltr" },
  { code: "fr", name: "French", native: "Français", tts: "fr", dir: "ltr" },
  { code: "de", name: "German", native: "Deutsch", tts: "de", dir: "ltr" },
  { code: "pt", name: "Portuguese", native: "Português", tts: "pt-PT", dir: "ltr" },
  { code: "it", name: "Italian", native: "Italiano", tts: "it", dir: "ltr" },
  { code: "nl", name: "Dutch", native: "Nederlands", tts: "nl", dir: "ltr" },
  { code: "pl", name: "Polish", native: "Polski", tts: "pl", dir: "ltr" },
  { code: "tr", name: "Turkish", native: "Türkçe", tts: "tr", dir: "ltr" },
  { code: "ar", name: "Arabic", native: "العربية", tts: "ar-SA", dir: "rtl" },
  { code: "hi", name: "Hindi", native: "हिन्दी", tts: "hi", dir: "ltr" },
  { code: "ja", name: "Japanese", native: "日本語", tts: "ja", dir: "ltr" },
  { code: "ko", name: "Korean", native: "한국어", tts: "ko", dir: "ltr" },
  { code: "zh", name: "Chinese", native: "中文", tts: "zh", dir: "ltr" },
  { code: "ru", name: "Russian", native: "Русский", tts: "ru", dir: "ltr" },
  { code: "sv", name: "Swedish", native: "Svenska", tts: "sv", dir: "ltr" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia", tts: "id", dir: "ltr" },
  { code: "th", name: "Thai", native: "ไทย", tts: "th", dir: "ltr" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt", tts: "vi", dir: "ltr" },
  { code: "cs", name: "Czech", native: "Čeština", tts: "cs", dir: "ltr" },
  { code: "ro", name: "Romanian", native: "Română", tts: "ro", dir: "ltr" },
  { code: "uk", name: "Ukrainian", native: "Українська", tts: "uk", dir: "ltr" },
  { code: "bn", name: "Bengali", native: "বাংলা", tts: "bn", dir: "ltr" },
] as const;

export type LocaleCode = (typeof LOCALES)[number]["code"];

export const VOICES = [
  { id: "eve", name: "Eve", type: "warm", best: "Personal assistant", line: "Clear, composed, easy to trust." },
  { id: "ara", name: "Ara", type: "assistant", best: "Personal assistant", line: "Bright and precise, built for briefings." },
  { id: "leo", name: "Leo", type: "sales", best: "Sales", line: "Confident closer with a human pace." },
  { id: "rex", name: "Rex", type: "warm", best: "Support", line: "Warm, friendly, naturally reassuring." },
  { id: "sal", name: "Sal", type: "professional", best: "Support", line: "Even, professional, good on long calls." },
  { id: "atlas", name: "Atlas", type: "professional", best: "Reception", line: "Global, steady, boardroom-ready." },
  { id: "aurora", name: "Aurora", type: "warm", best: "Personal assistant", line: "Soft lift, excellent overnight concierge." },
  { id: "liora", name: "Liora", type: "support", best: "Support", line: "Empathetic without sounding scripted." },
  { id: "carina", name: "Carina", type: "sales", best: "Sales", line: "Crisp outbound energy, never pushy." },
  { id: "naksh", name: "Naksh", type: "character", best: "Concierge", line: "Distinct presence across languages." },
  { id: "zagan", name: "Zagan", type: "character", best: "Collections", line: "Low, direct, keeps the line moving." },
  { id: "helix", name: "Helix", type: "professional", best: "IT helpdesk", line: "Technical diction, patient explanations." },
  { id: "orion", name: "Orion", type: "professional", best: "Sales", line: "Measured, senior, high-trust." },
  { id: "luna", name: "Luna", type: "assistant", best: "Personal assistant", line: "Quiet luxury. Calendar, travel, follow-ups." },
  { id: "wellness", name: "Wellness", type: "support", best: "Support", line: "Soothing register for sensitive calls." },
  { id: "support", name: "Support", type: "support", best: "Support", line: "Soft, empathetic, built for queues." },
] as const;

export const VOICE_TYPES = [
  { id: "warm", label: "Warm", hint: "Friendly, human, everyday" },
  { id: "professional", label: "Professional", hint: "Measured, credible, B2B" },
  { id: "sales", label: "Sales closer", hint: "Energy with restraint" },
  { id: "support", label: "Empathetic support", hint: "Calm under complaint" },
  { id: "assistant", label: "Concierge", hint: "Briefings, scheduling, taste" },
  { id: "character", label: "Character", hint: "Distinct brand voice" },
] as const;

export const USE_CASES = [
  {
    id: "assistant",
    name: "Personal assistant",
    kicker: "High value",
    summary: "Briefings, calendars, travel, follow-ups — a chief of staff that picks up.",
    bullets: ["Morning brief from Calendar and Gmail", "Books and moves meetings", "Screens unknown callers"],
  },
  {
    id: "sales",
    name: "Sales",
    kicker: "Revenue",
    summary: "Outbound qualification, inbound product questions, and booking on the first call.",
    bullets: ["Speaks the prospect’s language", "Logs CRM notes", "Hands hot leads to a human"],
  },
  {
    id: "support",
    name: "Support",
    kicker: "Always on",
    summary: "Tier-1 that actually resolves: orders, resets, refunds, with a clean escalate path.",
    bullets: ["Knowledge-base grounded answers", "After-hours coverage", "Sentiment-aware transfers"],
  },
  {
    id: "reception",
    name: "Reception",
    kicker: "Front desk",
    summary: "A local number that greets, routes, and takes a message in 23 languages.",
    bullets: ["Smart routing by intent", "Bilingual switchboard", "Missed-call text-back"],
  },
  {
    id: "booking",
    name: "Appointments",
    kicker: "Operations",
    summary: "Clinics, salons, field teams — confirm, reschedule, no-show recovery.",
    bullets: ["Google Calendar write-back", "Reminder calls", "Waitlist fill"],
  },
  {
    id: "collections",
    name: "Collections",
    kicker: "Finance",
    summary: "Polite, persistent, compliant dunning that still sounds like a person.",
    bullets: ["Payment-plan offers", "Guardrailed scripts", "Call-time windows"],
  },
] as const;

export const GUARDRAILS = [
  { id: "no_medical", label: "No medical advice", hint: "Symptoms get a human or a clinician." },
  { id: "no_legal", label: "No legal advice", hint: "Will not draft or interpret law." },
  { id: "no_financial", label: "No financial advice", hint: "No investment or tax guidance." },
  { id: "pii_redact", label: "Redact personal data", hint: "Masks card, national ID, secrets in logs." },
  { id: "profanity", label: "Keep it civil", hint: "Agent will not match abuse with abuse." },
  { id: "competitor", label: "No competitor talk", hint: "Declines to discuss named rivals." },
  { id: "escalate_anger", label: "Escalate anger", hint: "Transfers after two heated turns." },
  { id: "human_handoff", label: "Human handoff", hint: "Always offers a person on request." },
  { id: "after_hours", label: "After-hours only take messages", hint: "No irreversible actions overnight." },
  { id: "max_minutes", label: "Cap call length", hint: "Ends politely at the plan limit." },
] as const;

export const INTEGRATIONS = [
  { id: "gmail", name: "Gmail", group: "Google", blurb: "Read, draft, and send from the agent’s voice.", connector: "Gmail" },
  { id: "gcal", name: "Google Calendar", group: "Google", blurb: "Check availability and book while on the call.", connector: "GoogleCalendar" },
  { id: "gdrive", name: "Google Drive", group: "Google", blurb: "Ground answers in Docs, Sheets and PDFs.", connector: "GoogleDrive" },
  { id: "gsheets", name: "Google Sheets", group: "Google", blurb: "Log leads and tickets as rows.", connector: "GoogleDrive" },
  { id: "gcontacts", name: "Google Contacts", group: "Google", blurb: "Resolve who is calling.", connector: "Gmail" },
  { id: "meet", name: "Google Meet", group: "Google", blurb: "Spin up a Meet link mid-call.", connector: "GoogleCalendar" },
  { id: "outlook", name: "Outlook", group: "Microsoft", blurb: "Mail and calendar for Microsoft 365 shops.", connector: "Outlook" },
  { id: "teams", name: "Microsoft Teams", group: "Microsoft", blurb: "Post a summary into the right channel.", connector: "MicrosoftTeams" },
  { id: "hubspot", name: "HubSpot", group: "CRM", blurb: "Create contacts, deals and notes from the call." },
  { id: "salesforce", name: "Salesforce", group: "CRM", blurb: "Log activity against the account." },
  { id: "stripe", name: "Stripe", group: "Payments", blurb: "Take a card, send a link, check an invoice." },
  { id: "shopify", name: "Shopify", group: "Commerce", blurb: "Order status, refunds, tracking." },
  { id: "zendesk", name: "Zendesk", group: "Support", blurb: "Open and update tickets as you speak." },
  { id: "notion", name: "Notion", group: "Knowledge", blurb: "Use your Notion wiki as the knowledge base." },
  { id: "slack", name: "Slack", group: "Collab", blurb: "Page a human in Slack when it matters." },
  { id: "calendly", name: "Calendly", group: "Scheduling", blurb: "Offer the next open slot, booked live." },
  { id: "twilio", name: "Twilio", group: "Telephony", blurb: "Buy local numbers in 60+ countries." },
  { id: "whatsapp", name: "WhatsApp", group: "Messaging", blurb: "Same agent, on chat as well as voice." },
  { id: "zapier", name: "Zapier", group: "Automation", blurb: "Fire any of 6,000 apps from a tool call." },
  { id: "webhook", name: "Webhooks", group: "Developers", blurb: "POST events to your own backend." },
  { id: "mcp", name: "Custom MCP", group: "Developers", blurb: "Attach your own tools over MCP.", connector: "Mcp" },
] as const;

export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    monthly: 49,
    annual: 470,
    minutes: 200,
    agents: 1,
    numbers: 1,
    seats: 1,
    overage: 0.28,
    blurb: "One agent, one number, live this afternoon.",
    popular: false,
    features: [
      "1 live agent",
      "200 voice minutes / mo",
      "1 local number",
      "2 languages",
      "Grok 2.0 voice",
      "Basic guardrails",
      "Email support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    monthly: 149,
    annual: 1430,
    minutes: 1000,
    agents: 5,
    numbers: 3,
    seats: 5,
    overage: 0.22,
    popular: true,
    blurb: "The working stack for sales and support teams.",
    features: [
      "5 live agents",
      "1,000 voice minutes / mo",
      "3 local numbers",
      "All 23 languages",
      "Knowledge base",
      "Google Workspace tools",
      "Advanced guardrails",
      "Call analytics",
      "Priority email",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    monthly: 399,
    annual: 3830,
    minutes: 5000,
    agents: 25,
    numbers: 10,
    seats: 20,
    overage: 0.18,
    blurb: "Custom voices, dense minutes, an operator desk.",
    popular: false,
    features: [
      "25 live agents",
      "5,000 voice minutes / mo",
      "10 local numbers",
      "Custom / cloned voices",
      "All integrations",
      "SSO-ready workspace",
      "Shared inbox + tickets",
      "Success manager",
      "99.9% target uptime",
    ],
  },
] as const;

export type PlanId = (typeof PLANS)[number]["id"];

export const ENTERPRISE = {
  name: "Enterprise",
  blurb: "Dedicated numbers, VPC, custom SLAs, and a named operator.",
  cta: "Talk to sales",
} as const;

export const NUMBER_CATALOG: {
  e164: string;
  country: string;
  region: string;
  locality: string;
  number_type: "local" | "mobile" | "tollfree";
  monthly_cost_cents: number;
}[] = [
  { e164: "+44 20 3514 8821", country: "GB", region: "England", locality: "London", number_type: "local", monthly_cost_cents: 500 },
  { e164: "+44 161 768 4402", country: "GB", region: "England", locality: "Manchester", number_type: "local", monthly_cost_cents: 500 },
  { e164: "+1 415 555 0148", country: "US", region: "CA", locality: "San Francisco", number_type: "local", monthly_cost_cents: 400 },
  { e164: "+1 212 555 0194", country: "US", region: "NY", locality: "New York", number_type: "local", monthly_cost_cents: 500 },
  { e164: "+1 305 555 0177", country: "US", region: "FL", locality: "Miami", number_type: "local", monthly_cost_cents: 400 },
  { e164: "+33 1 89 71 44 20", country: "FR", region: "Île-de-France", locality: "Paris", number_type: "local", monthly_cost_cents: 500 },
  { e164: "+49 30 5683 7710", country: "DE", region: "Berlin", locality: "Berlin", number_type: "local", monthly_cost_cents: 500 },
  { e164: "+34 91 123 8840", country: "ES", region: "Madrid", locality: "Madrid", number_type: "local", monthly_cost_cents: 450 },
  { e164: "+39 02 9475 3310", country: "IT", region: "Lombardy", locality: "Milan", number_type: "local", monthly_cost_cents: 450 },
  { e164: "+31 20 532 4419", country: "NL", region: "North Holland", locality: "Amsterdam", number_type: "local", monthly_cost_cents: 500 },
  { e164: "+48 22 398 7701", country: "PL", region: "Mazovia", locality: "Warsaw", number_type: "local", monthly_cost_cents: 400 },
  { e164: "+90 212 909 4410", country: "TR", region: "Istanbul", locality: "Istanbul", number_type: "local", monthly_cost_cents: 350 },
  { e164: "+971 4 514 8820", country: "AE", region: "Dubai", locality: "Dubai", number_type: "local", monthly_cost_cents: 800 },
  { e164: "+91 22 4890 3311", country: "IN", region: "Maharashtra", locality: "Mumbai", number_type: "local", monthly_cost_cents: 300 },
  { e164: "+81 3 4520 7714", country: "JP", region: "Tokyo", locality: "Tokyo", number_type: "local", monthly_cost_cents: 700 },
  { e164: "+82 2 6410 2290", country: "KR", region: "Seoul", locality: "Seoul", number_type: "local", monthly_cost_cents: 650 },
  { e164: "+86 10 5387 4410", country: "CN", region: "Beijing", locality: "Beijing", number_type: "local", monthly_cost_cents: 600 },
  { e164: "+55 11 3042 8810", country: "BR", region: "São Paulo", locality: "São Paulo", number_type: "local", monthly_cost_cents: 400 },
  { e164: "+52 55 4160 2294", country: "MX", region: "CDMX", locality: "Mexico City", number_type: "local", monthly_cost_cents: 350 },
  { e164: "+61 2 8310 4418", country: "AU", region: "NSW", locality: "Sydney", number_type: "local", monthly_cost_cents: 550 },
  { e164: "+65 3163 7702", country: "SG", region: "Singapore", locality: "Singapore", number_type: "local", monthly_cost_cents: 800 },
  { e164: "+46 8 525 044 10", country: "SE", region: "Stockholm", locality: "Stockholm", number_type: "local", monthly_cost_cents: 500 },
  { e164: "+420 2 2620 4411", country: "CZ", region: "Prague", locality: "Prague", number_type: "local", monthly_cost_cents: 400 },
  { e164: "+30 21 1198 7703", country: "GR", region: "Attica", locality: "Athens", number_type: "local", monthly_cost_cents: 400 },
  { e164: "+972 3 376 4410", country: "IL", region: "Tel Aviv", locality: "Tel Aviv", number_type: "local", monthly_cost_cents: 600 },
];

export const DEMO_SCRIPTS: Record<string, { title: string; language: string; voice: string; line: string; prompt: string }> = {
  assistant: {
    title: "Personal assistant",
    language: "en",
    voice: "eve",
    line: "Good morning. You have three meetings today. The first is with Priya at ten, then a flight hold for Friday. Shall I brief you, or move the ten o’clock?",
    prompt:
      "You are a private personal assistant on a phone call. Be concise, warm, and specific. Help with calendar, travel, and follow-ups. Never invent private facts; ask if unsure.",
  },
  sales: {
    title: "Sales",
    language: "en",
    voice: "carina",
    line: "Hi, this is Maya from Northwind. I saw you were comparing Growth and Scale — I can walk you through minutes and numbers in two minutes, or book you with a specialist. What works?",
    prompt:
      "You are an outbound sales agent for Roamr voice agents. Qualify politely, never be pushy, offer to book a callback. Price Starter $49, Growth $149, Scale $399 monthly.",
  },
  support: {
    title: "Support",
    language: "en",
    voice: "support",
    line: "I’m sorry the delivery slipped. I’ve found the parcel — it’s out for delivery, expected before six. I can text the live tracking now, or stay on the line. What would you like?",
    prompt:
      "You are a customer-support voice agent. Acknowledge the issue, resolve from the knowledge you have, offer a human if asked. Never invent refunds; offer to escalate.",
  },
};

export const DEFAULT_GUARDRAILS: Record<string, boolean> = {
  no_medical: true,
  no_legal: true,
  no_financial: true,
  pii_redact: true,
  profanity: true,
  competitor: false,
  escalate_anger: true,
  human_handoff: true,
  after_hours: false,
  max_minutes: true,
};

export function planById(id: string) {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

export function planPrice(id: string, interval: "monthly" | "annual") {
  const p = planById(id);
  return interval === "annual" ? p.annual : p.monthly;
}

export function localeByCode(code: string) {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0];
}

export function voicesForType(type: string) {
  return VOICES.filter((v) => v.type === type);
}
