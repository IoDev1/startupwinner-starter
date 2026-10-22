import Link from "next/link";
import { site } from "@/lib/site";

export function Header({ signedIn }: { signedIn?: boolean }) {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
      <Link href="/" className="font-semibold">
        {site.name}
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/#pricing" className="text-muted hover:text-foreground">
          Pricing
        </Link>
        {signedIn ? (
          <Link href="/app" className="rounded-lg bg-accent px-3 py-1.5 font-medium text-accent-foreground">
            Open app
          </Link>
        ) : (
          <Link href="/login" className="rounded-lg bg-accent px-3 py-1.5 font-medium text-accent-foreground">
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mx-auto mt-auto flex w-full max-w-5xl flex-wrap gap-4 px-4 py-8 text-sm text-muted">
      <span>© {site.company}</span>
      <Link href="/privacy" className="hover:text-foreground">
        Privacy
      </Link>
      <Link href="/terms" className="hover:text-foreground">
        Terms
      </Link>
      <a href={`mailto:${site.contactEmail}`} className="hover:text-foreground">
        Contact
      </a>
    </footer>
  );
}
