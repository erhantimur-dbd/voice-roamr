import { CHAT_MODEL } from "@/lib/product";

const TTS_CAP = 500;
const STT_SECONDS_CAP = 20;

export function xaiKey(): string | undefined {
  const k = process.env.XAI_API_KEY?.trim();
  return k || undefined;
}

export async function synthesizeSpeech(input: {
  text: string;
  voiceId: string;
  language: string;
}): Promise<{ ok: true; audio: string; mime: string } | { ok: false; error: string }> {
  const apiKey = xaiKey();
  if (!apiKey) return { ok: false, error: "Voice is not available in this environment." };
  const text = input.text.trim().slice(0, TTS_CAP);
  if (!text) return { ok: false, error: "Nothing to say." };

  const res = await fetch("https://api.x.ai/v1/tts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      voice_id: input.voiceId,
      language: input.language || "en",
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return { ok: false, error: `Voice error ${res.status}${detail ? `: ${detail.slice(0, 180)}` : ""}` };
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const mime = res.headers.get("content-type") || "audio/mpeg";
  return { ok: true, audio: buf.toString("base64"), mime };
}

export async function transcribeAudio(input: {
  audioBase64: string;
  mime: string;
}): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const apiKey = xaiKey();
  if (!apiKey) return { ok: false, error: "Voice is not available in this environment." };
  const raw = Buffer.from(input.audioBase64, "base64");
  if (raw.byteLength < 64) return { ok: false, error: "Recording too short." };
  if (raw.byteLength > 1_500_000) return { ok: false, error: "Recording too long." };

  const form = new FormData();
  const blob = new Blob([raw], { type: input.mime || "audio/webm" });
  form.append("file", blob, "clip.webm");
  form.append("model", "grok-stt");

  let res = await fetch("https://api.x.ai/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });
  if (!res.ok) {
    res = await fetch("https://api.x.ai/v1/stt", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });
  }
  if (!res.ok) {
    return { ok: false, error: `Could not transcribe (${res.status}).` };
  }
  const body = (await res.json()) as { text?: string; transcript?: string };
  const text = (body.text ?? body.transcript ?? "").trim();
  if (!text) return { ok: false, error: "I didn’t catch that." };
  void STT_SECONDS_CAP;
  return { ok: true, text };
}

export async function grokReply(input: {
  system: string;
  history: { role: "user" | "assistant"; content: string }[];
  user: string;
}): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const apiKey = xaiKey();
  if (!apiKey) return { ok: false, error: "Voice is not available in this environment." };

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      max_tokens: 180,
      temperature: 0.6,
      messages: [
        { role: "system", content: input.system },
        ...input.history.slice(-6),
        { role: "user", content: input.user.slice(0, 800) },
      ],
    }),
  });
  if (!res.ok) return { ok: false, error: `Grok error ${res.status}` };
  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = body.choices?.[0]?.message?.content?.trim() ?? "";
  if (!text) return { ok: false, error: "Empty reply." };
  return { ok: true, text };
}
