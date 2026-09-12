import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { LogoWord } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Sign in — Roamr" }] }),
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const res = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/app",
    });
    setPending(false);
    if (res.error) setError(res.error.message ?? "Could not sign in");
    else window.location.assign("/app");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="inline-flex">
          <LogoWord />
        </Link>
        <h1 className="mt-8 font-display text-3xl tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-muted">Sign in to your voice workspace.</p>
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
              <Input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              <Input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
              {error ? <p className="text-sm text-danger">{error}</p> : null}
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted">Sign-in is disabled.</p>
        )}
        <p className="mt-6 text-sm text-muted">
          New here?{" "}
          <Link to="/signup" className="text-fg underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
