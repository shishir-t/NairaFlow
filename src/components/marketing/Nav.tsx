import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-nf-border/80 bg-neutral-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-neutral-300 md:flex">
          <a href="#problem" className="hover:text-white">Problem</a>
          <a href="#solution" className="hover:text-white">Solution</a>
          <a href="#market" className="hover:text-white">Market</a>
          <a href="#roadmap" className="hover:text-white">Roadmap</a>
          <a href="#ask" className="hover:text-white">The Ask</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-md px-3 py-2 text-sm font-medium text-neutral-200 hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-nf-green px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-nf-green/90"
          >
            Open an account
          </Link>
        </div>
      </div>
    </header>
  );
}
