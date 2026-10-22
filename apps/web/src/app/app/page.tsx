import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/chrome";
import { currentUser } from "@/lib/auth";
import { planOf } from "@/lib/billing";

export const metadata: Metadata = { title: "Home" };

// The signed-in home. Build your core flow here.
export default async function AppHome({ searchParams }: PageProps<"/app">) {
  const user = (await currentUser())!; // the proxy only lets signed-in people here
  const plan = await planOf(user.id);
  const { checkout } = await searchParams;

  return (
    <>
      <Header signedIn />
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        {checkout === "success" && (
          <p className="mb-4 rounded-lg bg-good-bg px-3 py-2 text-sm">Thanks! Your plan updates in a few seconds.</p>
        )}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Your app starts here</h1>
          <Link href="/account" className="text-sm text-muted hover:text-foreground">
            {user.email} · {plan.pro ? "Pro" : "Free"}
          </Link>
        </div>
        <div className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center text-muted">
          The one core flow goes here.
        </div>
      </main>
    </>
  );
}
