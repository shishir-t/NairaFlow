import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-nf-border/80 bg-neutral-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="shrink-0">
          <Logo className="text-sm sm:text-base" />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-neutral-300 md:flex">
          <a href="#problem" className="hover:text-white">Problem</a>
          <a href="#solution" className="hover:text-white">Solution</a>
          <a href="#market" className="hover:text-white">Market</a>
          <a href="#roadmap" className="hover:text-white">Roadmap</a>
          <a href="#ask" className="hover:text-white">The Ask</a>
        </nav>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <Link
            href="/login"
            className="whitespace-nowrap rounded-md px-2 py-2 text-xs font-medium text-neutral-200 hover:text-white sm:px-3 sm:text-sm"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="whitespace-nowrap rounded-md bg-nf-green px-3 py-2 text-xs font-semibold text-neutral-950 transition hover:bg-nf-green/90 sm:px-4 sm:text-sm"
          >
            <span className="sm:hidden">Sign up</span>
            <span className="hidden sm:inline">Open an account</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
