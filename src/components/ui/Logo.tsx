import clsx from "clsx";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-2 font-bold tracking-tight", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-nf-green to-nf-green-dark text-base text-white shadow-sm">
        ₦
      </span>
      <span>
        Naira<span className="text-nf-green">Flow</span>
      </span>
    </span>
  );
}
