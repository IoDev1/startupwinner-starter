import type { Metadata } from "next";
import { Header } from "@/components/chrome";
import { safeNext } from "@/lib/safe-next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function Login({ searchParams }: PageProps<"/login">) {
  const { next, error } = await searchParams;
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-sm px-4 py-16">
        <h1 className="mb-6 text-2xl font-bold">Sign in</h1>
        {error && (
          <p className="mb-4 rounded-lg bg-bad-bg px-3 py-2 text-sm">That link has expired or was already used. Send a new code.</p>
        )}
        <LoginForm next={safeNext(typeof next === "string" ? next : null)} />
      </main>
    </>
  );
}
