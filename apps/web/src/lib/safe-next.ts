/**
 * Where to go after sign-in: only a path on this site. Anything else (another origin,
 * protocol-relative "//evil.com", backslash or control-character tricks) falls back.
 */
export function safeNext(next: string | null | undefined, fallback = "/app") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || /[\\\u0000-\u001f]/.test(next)) return fallback;
  const url = new URL(next, "https://placeholder.invalid");
  return url.origin === "https://placeholder.invalid" ? url.pathname + url.search : fallback;
}
