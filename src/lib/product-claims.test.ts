import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { INTEGRATIONS, LOCALES, PLANS, USE_CASES } from "./product.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

const SOFT_LAUNCH_LANGS = [
  "en",
  "es",
  "fr",
  "de",
  "pt",
  "it",
  "nl",
  "pl",
  "tr",
  "ar",
  "hi",
  "ja",
  "ko",
  "zh",
  "ru",
  "sv",
  "id",
  "th",
  "vi",
  "cs",
  "ro",
  "uk",
  "bn",
] as const;

describe("Soft Launch claim hygiene", () => {
  it("locks languages to the exact Soft Launch 23 (no Greek or Hebrew)", () => {
    assert.deepEqual(
      LOCALES.map((l) => l.code),
      [...SOFT_LAUNCH_LANGS],
    );
    assert.equal(LOCALES.length, 23);
    const names = LOCALES.flatMap((l) => [l.name, l.native, l.code]).join(" ");
    assert.doesNotMatch(names, /Greek|Hebrew|Ελληνικά|עברית|\bel\b|\bhe\b/i);
  });

  it("marks Google Workspace Live and every other connector Coming", () => {
    const google = INTEGRATIONS.filter((i) => i.group === "Google");
    assert.ok(google.length >= 6);
    for (const i of google) assert.equal(i.status, "live");

    const others = INTEGRATIONS.filter((i) => i.group !== "Google");
    assert.ok(others.some((i) => i.id === "twilio"));
    for (const i of others) assert.equal(i.status, "coming", `${i.name} must be Coming`);
  });

  it("does not claim Scale has all integrations or Sales CRM write-back", () => {
    const scale = PLANS.find((p) => p.id === "scale");
    assert.ok(scale);
    assert.ok(scale.features.some((f) => /Google Workspace Live/i.test(f)));
    assert.ok(scale.features.some((f) => /Coming/i.test(f)));
    assert.ok(!scale.features.some((f) => /all integrations/i.test(f)));

    const sales = USE_CASES.find((u) => u.id === "sales");
    assert.ok(sales);
    assert.ok(!sales.bullets.some((b) => /logs crm notes/i.test(b)));
    assert.ok(sales.bullets.some((b) => /google sheets/i.test(b)));
  });

  it("keeps Soft CTA copy and no trial / buy-now / deploy-now strings", () => {
    const i18n = readFileSync(join(root, "src/lib/i18n.ts"), "utf8");
    assert.match(i18n, /scheduleDemo: "Schedule a demo"/);
    assert.match(i18n, /start: "Sign up"/);
    assert.match(i18n, /demo: "Hear an agent"/);
    assert.match(i18n, /assistant: "AI receptionist"/);
    assert.match(i18n, /Give it a real-number proposition/);
    assert.match(i18n, /books through Google Calendar/);
    assert.match(i18n, /Twilio local numbers \(Coming\)/);
    assert.doesNotMatch(i18n, /Buy a local line|Buy London|Start free|7-day trial|buy now|deploy now/i);
    assert.doesNotMatch(i18n, /Annual is available at checkout/);
  });

  it("labels Twilio Coming in llms.txt and does not over-claim Scale integrations there", () => {
    const llms = readFileSync(join(root, "public/llms.txt"), "utf8");
    assert.match(llms, /Twilio local numbers \(Coming\)/);
    assert.doesNotMatch(llms, /^[-*] Twilio local numbers$/m);
    assert.doesNotMatch(llms, /All integrations/i);
    assert.match(llms, /Schedule a demo/);
    assert.doesNotMatch(llms, /Greek|Hebrew/i);
    assert.match(llms, /English, Spanish, French, German, Portuguese, Italian, Dutch, Polish, Turkish, Arabic, Hindi, Japanese, Korean, Chinese, Russian, Swedish, Indonesian, Thai, Vietnamese, Czech, Romanian, Ukrainian, Bengali/);
  });

  it("quotes website plan facts without inventing Stripe-verified checkout", () => {
    assert.deepEqual(
      PLANS.map((p) => [p.id, p.monthly, p.numbers]),
      [
        ["starter", 49, 1],
        ["growth", 149, 3],
        ["scale", 399, 10],
      ],
    );
    const scale = PLANS.find((p) => p.id === "scale");
    assert.ok(scale?.features.some((f) => /99\.9% target uptime/.test(f)));
  });
});
