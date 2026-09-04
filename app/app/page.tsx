import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { films } from "@/data/films";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="relative flex flex-1 flex-col justify-center px-6 pb-20 pt-8 md:px-10">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] opacity-40"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(180deg, transparent 0%, var(--background) 100%), repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(46,40,36,0.35) 80px, rgba(46,40,36,0.35) 81px)",
          }}
        />
        <div className="relative mx-auto w-full max-w-3xl">
          <p className="animate-rise font-[family-name:var(--font-display)] text-[clamp(4.5rem,18vw,9rem)] leading-[0.85] tracking-tight text-cream">
            Hlist
          </p>
          <h1 className="animate-rise-delay mt-6 max-w-xl font-[family-name:var(--font-display)] text-2xl leading-snug text-cream md:text-3xl">
            Le film d&apos;horreur qu&apos;il te faut, trouvé par questions.
          </h1>
          <p className="animate-rise-delay-2 mt-4 max-w-md text-base leading-relaxed text-muted md:text-lg">
            Réponds, affine par tags, et plonge dans un corpus curaté de
            classiques — du slow burn au slash le plus nerveux.
          </p>
          <div className="animate-rise-delay-2 mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/discover"
              className="inline-flex items-center bg-blood px-7 py-3.5 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-blood-dim"
            >
              Trouver un film
            </Link>
            <span className="text-sm text-muted">
              {films.length} titres · tags maison
            </span>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
