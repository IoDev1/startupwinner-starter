import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

/** Supabase as the signed-in person, for Server Components, Server Actions and Route Handlers. */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(env.supabaseUrl, env.supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components can't set cookies; the proxy refreshes sessions instead.
        }
      },
    },
  });
}
