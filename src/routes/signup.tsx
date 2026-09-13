import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { LogoWord } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/signup")({
  component: Signup,
  head: () => ({ meta: [{ title: "Create account — Roamr" }] }),
});

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const res = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: "/app",
    });
    setPending(false);
    if (res.error) setError(res.error.message ?? "Could not create account");
    else window.location.assign("/app");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="inline-flex">
          <LogoWord />
        </Link>
        <h1 className="mt-8 font-display text-3xl tracking-tight">Start your workspace</h1>
        <p className="mt-2 text-sm text-muted">Create an account to publish a voice agent on Grok 2.0.</p>
        {authEnabled ? (
          <div className="mt-6 space-y-3">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => signIn(p.providerId, { callbackURL: "/app" })}
              >
                Continue with {p.label}
              </Button>
            ))}
            <p className="text-center text-xs uppercase tracking-[0.16em] text-subtle">or email</p>
            <form onSubmit={onEmail} className="space-y-3">
              <Input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              <Input type="email" required placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              <Input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={8} />
              {error ? <p className="text-sm text-danger">{error}</p> : null}
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Creating…" : "Create account"}
              </Button>
            </form>
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted">Sign-in is disabled.</p>
        )}
        <p className="mt-6 text-sm text-muted">
          Already on Roamr?{" "}
          <Link to="/login" className="text-fg underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
