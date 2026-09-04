import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { films, getFilm } from "@/data/films";
import { tagLabel } from "@/data/tags";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { tmdbPosterUrl } from "@/lib/tmdb";

export function generateStaticParams() {
  return films.map((film) => ({ id: film.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/films/[id]">) {
  const { id } = await params;
  const film = getFilm(id);
  if (!film) return { title: "Film introuvable — Hlist" };
  return {
    title: `${film.title} (${film.year}) — Hlist`,
    description: film.synopsis,
  };
}

export default async function FilmPage({
  params,
}: PageProps<"/films/[id]">) {
  const { id } = await params;
  const film = getFilm(id);
  if (!film) notFound();

  const initial = film.title.trim().charAt(0).toUpperCase();
  const poster = tmdbPosterUrl(film.posterPath, "w500");

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10 md:px-10 md:py-16">
        <Link
          href="/discover"
          className="text-sm text-muted transition-colors hover:text-cream"
        >
          ← Retour aux résultats
        </Link>

        <div className="mt-8 grid gap-10 md:grid-cols-[14rem_1fr] md:gap-14">
          <div
            className="relative aspect-[2/3] overflow-hidden bg-surface"
            style={
              poster
                ? undefined
                : {
                    background: `linear-gradient(160deg, hsl(${hashHue(film.id)} 28% 22%) 0%, #1a1614 70%)`,
                  }
            }
          >
            {poster ? (
              <Image
                src={poster}
                alt={`Affiche de ${film.title}`}
                fill
                sizes="224px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span className="font-[family-name:var(--font-display)] text-6xl text-cream/90">
                  {initial}
                </span>
                <span className="text-xs tracking-[0.25em] text-cream/50">
                  {film.year}
                </span>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm tracking-wide text-muted">{film.year}</p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl leading-tight text-cream md:text-5xl">
              {film.title}
            </h1>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted">
              {film.synopsis}
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {film.tags.map((tag) => (
                <li
                  key={tag}
                  className="bg-surface px-3 py-1 text-xs text-cream/80"
                >
                  {tagLabel(tag)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function hashHue(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * 17) % 360;
  return h;
}
