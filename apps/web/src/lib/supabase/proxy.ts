import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

const PROTECTED = ["/app", "/account"];

/** Refreshes the session cookie and sends signed-out visitors of protected pages to /login. */
export async function updateSession(request: NextRequest) {
  // Before Supabase is set up, public pages still open; signed-in pages say what's missing.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return NextResponse.next();
  let response = NextResponse.next({ request });
  const supabase = createServerClient(env.supabaseUrl, env.supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getUser() validates the token with Supabase; don't run code between creating the client and this call.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;
  if (!user && PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname + search);
    return NextResponse.redirect(login);
  }
  return response;
}
