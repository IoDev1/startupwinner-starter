import { Footer, Header } from "@/components/chrome";

/** Layout for the legal pages. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-muted">Last updated {updated}</p>
        <p className="mt-6 rounded-lg bg-bad-bg px-3 py-2 text-sm">
          Starter text: have it reviewed for your product and country before launch, then remove this note.
        </p>
        <div className="mt-6 space-y-4 leading-relaxed [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
