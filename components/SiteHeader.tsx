import Link from "next/link";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10">
      <Link
        href="/"
        className="font-[family-name:var(--font-display)] text-xl tracking-tight text-cream transition-colors hover:text-blood md:text-2xl"
      >
        Hlist
      </Link>
      {!compact && (
        <Link
          href="/discover"
          className="text-sm tracking-wide text-muted transition-colors hover:text-cream"
        >
          Découvrir
        </Link>
      )}
    </header>
  );
}
