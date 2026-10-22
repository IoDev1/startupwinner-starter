import type { Metadata } from "next";
import { Header } from "@/components/chrome";
import { currentUser } from "@/lib/auth";
import { planOf } from "@/lib/billing";
import { site } from "@/lib/site";
import { deleteMyAccount, openPortal, startCheckout } from "./actions";

export const metadata: Metadata = { title: "Account" };

const card = "rounded-2xl border border-border bg-surface p-5";
const primary = "rounded-xl bg-accent px-4 py-2 font-semibold text-accent-foreground";
const secondary = "rounded-xl border border-border px-4 py-2 font-medium";

export default async function Account({ searchParams }: PageProps<"/account">) {
  const user = (await currentUser())!; // the proxy only lets signed-in people here
  const plan = await planOf(user.id);
  const { delete: deleteState } = await searchParams;

  return (
    <>
      <Header signedIn />
      <main className="mx-auto w-full max-w-2xl space-y-4 px-4 py-8">
        <h1 className="text-2xl font-bold">Account</h1>

        <section className={card}>
          <div className="text-sm text-muted">Signed in as</div>
          <div className="font-medium">{user.email}</div>
          <form action="/auth/signout" method="post" className="mt-4">
            <button className={secondary}>Sign out</button>
          </form>
        </section>

        <section className={card}>
          <h2 className="font-semibold">Plan</h2>
          <p className="mt-1 text-sm text-muted">
            {plan.pro
              ? `${site.pricing.pro.name}${plan.cancelling ? ", ends at the end of this period" : ""}${plan.status === "past_due" ? " (payment failed, update your card)" : ""}`
              : `${site.pricing.free.name}. ${site.pricing.pro.name} is ${site.pricing.pro.price}.`}
          </p>
          <div className="mt-4 flex gap-2">
            {!plan.pro && (
              <form action={startCheckout}>
                <button className={primary}>Upgrade to {site.pricing.pro.name}</button>
              </form>
            )}
            {plan.status && (
              <form action={openPortal}>
                <button className={secondary}>Billing and invoices</button>
              </form>
            )}
          </div>
        </section>

        <section className={`${card} border-bad/40`}>
          <h2 className="font-semibold">Delete account</h2>
          <p className="mt-1 text-sm text-muted">
            Deletes your account and everything in it, and cancels your subscription right away. This can&apos;t be
            undone.
          </p>
          <form action={deleteMyAccount} className="mt-4 flex flex-wrap items-center gap-2">
            <input
              name="confirm"
              placeholder="Type DELETE"
              aria-label="Type DELETE to confirm"
              className="rounded-xl border border-border bg-background px-3 py-2"
            />
            <button className="rounded-xl bg-bad px-4 py-2 font-semibold text-white">Delete my account</button>
          </form>
          {deleteState === "confirm" && <p className="mt-2 text-sm text-bad">Type DELETE in capitals to confirm.</p>}
        </section>
      </main>
    </>
  );
}
