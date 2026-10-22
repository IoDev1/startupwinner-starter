import "server-only";
import { createClient as createSupabase } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

/** The signed-in person from the session cookie, or null. */
export async function currentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** The person behind "Authorization: Bearer <access token>" (the mobile app), or null. */
export async function bearerUser(authorization: string | null) {
  const token = authorization?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return null;
  const supabase = createSupabase(env.supabaseUrl, env.supabasePublishableKey, { auth: { persistSession: false } });
  const {
    data: { user },
  } = await supabase.auth.getUser(token);
  return user;
}
