import Link from "next/link";
import { Footer, Header } from "@/components/chrome";
import { currentUser } from "@/lib/auth";
import { site } from "@/lib/site";

export default async function Home() {
  const user = await currentUser().catch(() => null);
  return (
    <>
      <Header signedIn={Boolean(user)} />
      <main className="mx-auto w-full max-w-5xl px-4">
        <section className="py-20 text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">{site.promise}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">{site.description}</p>
          <Link
            href={user ? "/app" : "/login"}
            className="mt-8 inline-block rounded-xl bg-accent px-6 py-3 font-semibold text-accent-foreground"
          >
            {user ? "Open the app" : "Start free"}
          </Link>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {site.features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="font-semibold">{f.title}</h2>
              <p className="mt-2 text-sm text-muted">{f.text}</p>
            </div>
          ))}
        </section>

        <section id="pricing" className="py-20">
          <h2 className="text-center text-3xl font-bold">Pricing</h2>
          <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
            {[site.pricing.free, site.pricing.pro].map((plan, i) => (
              <div
                key={plan.name}
                className={`rounded-2xl border bg-surface p-6 ${i === 1 ? "border-accent" : "border-border"}`}
              >
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="mt-2 text-3xl font-bold">{plan.price}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {plan.points.map((p) => (
                    <li key={p}>✓ {p}</li>
                  ))}
                </ul>
                <Link
                  href={user ? "/account" : "/login"}
                  className={`mt-6 block rounded-xl px-4 py-2.5 text-center font-semibold ${
                    i === 1 ? "bg-accent text-accent-foreground" : "border border-border"
                  }`}
                >
                  {i === 1 ? "Go Pro" : "Start free"}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
