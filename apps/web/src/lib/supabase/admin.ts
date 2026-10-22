import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env, required } from "@/lib/env";

/**
 * Service-role client: bypasses row-level security. Only for webhooks and actions that
 * have already checked who is asking.
 */
export function createAdminClient() {
  const key = required("SUPABASE_SECRET_KEY", process.env.SUPABASE_SECRET_KEY);
  return createClient(env.supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
