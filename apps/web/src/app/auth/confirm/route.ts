import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { track } from "@/lib/analytics";
import { safeNext } from "@/lib/safe-next";
import { createClient } from "@/lib/supabase/server";

/**
 * The link in the sign-in email lands here. Supabase's default email sends ?code=
 * (works in the browser that asked for it); a template with {{ .TokenHash }} sends
 * ?token_hash= (works in any browser). README, "Sign-in email".
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNext(searchParams.get("next"));
  const supabase = await createClient();

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const result = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: (searchParams.get("type") ?? "email") as EmailOtpType })
      : null;

  if (result && !result.error && result.data.user) {
    await track(result.data.user.id, "signed_in", { method: "link" });
    return NextResponse.redirect(new URL(next, origin));
  }
  const login = new URL("/login", origin);
  login.searchParams.set("error", "link");
  return NextResponse.redirect(login);
}
