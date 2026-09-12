import { Mic, Square, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { DEMO_SCRIPTS, LOCALES, VOICES } from "@/lib/product";
import { speakPreview, talkTurn } from "@/lib/voice/functions";
import { cn } from "@/lib/utils";

type Scenario = keyof typeof DEMO_SCRIPTS;

function playBase64(audio: string, mime: string) {
  const src = `data:${mime};base64,${audio}`;
  const el = new Audio(src);
  void el.play();
  return el;
}

export function VoiceDemo({
  labels,
}: {
  labels: {
    listen: string;
    talk: string;
    talking: string;
    thinking: string;
    assistant: string;
    sales: string;
    support: string;
  };
}) {
  const [scenario, setScenario] = useState<Scenario>("assistant");
  const [voiceId, setVoiceId] = useState(DEMO_SCRIPTS.assistant.voice);
  const [language, setLanguage] = useState("en");
  const [status, setStatus] = useState<"idle" | "playing" | "recording" | "thinking" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setVoiceId(DEMO_SCRIPTS[scenario].voice);
  }, [scenario]);

  async function playSample() {
    setError(null);
    setStatus("thinking");
    const res = await speakPreview({
      data: { scenario, voiceId, language },
    });
    if (!res.ok) {
      setError(res.error);
      setStatus("error");
      return;
    }
    setStatus("playing");
    audioRef.current?.pause();
    audioRef.current = playBase64(res.audio, res.mime);
    audioRef.current.onended = () => setStatus("idle");
  }

  async function toggleTalk() {
    if (status === "recording") {
      recRef.current?.stop();
      return;
    }
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        const buf = await blob.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let binary = "";
        bytes.forEach((b) => {
          binary += String.fromCharCode(b);
        });
        setStatus("thinking");
        const res = await talkTurn({
          data: {
            audioBase64: btoa(binary),
            mime: blob.type || "audio/webm",
            scenario,
            voiceId,
            language,
            history: log,
          },
        });
        if (!res.ok) {
          setError("error" in res ? res.error : "Could not reply.");
          setStatus("error");
          return;
        }
        setLog((prev) => [
          ...prev,
          { role: "user", content: res.userText },
          { role: "assistant", content: res.replyText },
        ]);
        setStatus("playing");
        audioRef.current?.pause();
        audioRef.current = playBase64(res.audio, res.mime);
        audioRef.current.onended = () => setStatus("idle");
      };
      recRef.current = rec;
      rec.start();
      setStatus("recording");
      window.setTimeout(() => {
        if (rec.state === "recording") rec.stop();
      }, 12000);
    } catch {
      setError("Microphone permission is needed to talk.");
      setStatus("error");
    }
  }

  const scenarios: { id: Scenario; label: string }[] = [
    { id: "assistant", label: labels.assistant },
    { id: "sales", label: labels.sales },
    { id: "support", label: labels.support },
  ];

  return (
    <div className="surface-card hairline p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-subtle">Console</p>
        <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
          {status === "idle" ? "Ready" : status === "playing" ? "Playback" : status === "recording" ? "Live" : status === "thinking" ? "Working" : "Error"}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {scenarios.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setScenario(s.id)}
            className={cn(
              "h-9 rounded-[4px] px-3 text-sm grain-hover",
              scenario === s.id ? "bg-ink text-paper" : "border border-ink text-ink",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="mt-5 font-display text-xl leading-snug tracking-tight text-fg sm:text-[1.35rem]">
        {DEMO_SCRIPTS[scenario].line}
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-medium uppercase tracking-[0.14em] text-subtle">
          Voice
          <select
            className="mt-1 h-11 w-full rounded-[4px] border border-border bg-zinc px-3 text-sm text-fg"
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value)}
          >
            {VOICES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} — {v.best}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium uppercase tracking-[0.14em] text-subtle">
          Language
          <select
            className="mt-1 h-11 w-full rounded-[4px] border border-border bg-zinc px-3 text-sm text-fg"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {LOCALES.map((l) => (
              <option key={l.code} value={l.tts}>
                {l.native}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Waveform active={status === "playing" || status === "recording"} />
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button type="button" onClick={() => void playSample()} disabled={status === "thinking"} className="flex-1">
          <Volume2 />
          {status === "thinking" ? labels.thinking : labels.listen}
        </Button>
        <Button
          type="button"
          variant={status === "recording" ? "danger" : "secondary"}
          onClick={() => void toggleTalk()}
          className="flex-1"
        >
          {status === "recording" ? <Square /> : <Mic />}
          {status === "recording" ? labels.talking : labels.talk}
        </Button>
      </div>
      {error ? <p className="mt-3 text-sm text-muted">{error}</p> : null}
      {log.length ? (
        <ol className="mt-5 space-y-2 border-t border-border pt-4">
          {log.slice(-4).map((m, i) => (
            <li key={`${m.role}-${i}`} className="text-sm">
              <span className="text-xs uppercase tracking-[0.14em] text-subtle">
                {m.role === "user" ? "You" : "Agent"}
              </span>
              <p className="text-fg">{m.content}</p>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

function Waveform({ active }: { active: boolean }) {
  return (
    <div className="mt-5 flex h-10 items-end justify-between gap-px" aria-hidden="true">
      {Array.from({ length: 32 }).map((_, i) => (
        <span
          key={i}
          className={cn("w-full bg-ink/25", active ? "animate-pulse" : "")}
          style={{
            height: `${14 + ((i * 17) % 22)}px`,
            animationDelay: `${i * 40}ms`,
          }}
        />
      ))}
    </div>
  );
}
