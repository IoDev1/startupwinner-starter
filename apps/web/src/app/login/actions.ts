"use server";

import { redirect } from "next/navigation";
import { track } from "@/lib/analytics";
import { safeNext } from "@/lib/safe-next";
import { siteUrl } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { step: "email" | "code"; email?: string; next?: string; error?: string };

/** Emails a sign-in link and a 6-digit code; creates the account on first sign-in. */
export async function sendCode(_: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim();
  const next = safeNext(String(form.get("next") ?? ""));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { step: "email", error: "Enter a valid email address." };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true, emailRedirectTo: `${siteUrl()}/auth/confirm?next=${encodeURIComponent(next)}` },
  });
  if (error) return { step: "email", email, next, error: error.message };
  return { step: "code", email, next };
}

/** Signs in with the code from the email (the link in the same email works too). */
export async function verifyCode(_: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "");
  const token = String(form.get("code") ?? "").replace(/\s/g, "");
  const next = safeNext(String(form.get("next") ?? ""));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
  if (error || !data.user) return { step: "code", email, next, error: "That code didn't work. Check it, or send a new one." };
  await track(data.user.id, "signed_in", { method: "code" });
  redirect(next);
}
