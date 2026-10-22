"use client";

import { useActionState } from "react";
import { sendCode, verifyCode, type LoginState } from "./actions";

const input = "w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-accent";
const button = "w-full rounded-xl bg-accent px-4 py-2.5 font-semibold text-accent-foreground disabled:opacity-60";

export function LoginForm({ next }: { next: string }) {
  const [sent, send, sending] = useActionState(sendCode, { step: "email", next } as LoginState);
  const [checked, verify, verifying] = useActionState(verifyCode, { step: "code" } as LoginState);

  if (sent.step === "email") {
    return (
      <form action={send} className="space-y-3">
        <input type="hidden" name="next" value={next} />
        <label className="block text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" defaultValue={sent.email} className={input} />
        {sent.error && <p className="text-sm text-bad">{sent.error}</p>}
        <button className={button} disabled={sending}>
          {sending ? "Sending…" : "Email me a sign-in code"}
        </button>
        <p className="text-xs text-muted">No password. New here? This creates your account.</p>
      </form>
    );
  }

  return (
    <form action={verify} className="space-y-3">
      <input type="hidden" name="email" value={sent.email} />
      <input type="hidden" name="next" value={sent.next} />
      <p className="text-sm">
        We sent a code to <strong>{sent.email}</strong>. Enter it, or open the link in the email.
      </p>
      <input
        name="code"
        inputMode="numeric"
        autoComplete="one-time-code"
        required
        placeholder="123456"
        className={`${input} text-center font-mono text-lg tracking-widest`}
      />
      {checked.error && <p className="text-sm text-bad">{checked.error}</p>}
      <button className={button} disabled={verifying}>
        {verifying ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
