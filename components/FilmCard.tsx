import Image from "next/image";
import Link from "next/link";
import type { Film } from "@/data/types";
import { tagLabel } from "@/data/tags";
import { tmdbPosterUrl } from "@/lib/tmdb";

export function FilmCard({ film }: { film: Film }) {
  const initial = film.title.trim().charAt(0).toUpperCase();
  const poster = tmdbPosterUrl(film.posterPath, "w342");

  return (
    <Link
      href={`/films/${film.id}`}
      className="group block outline-none transition-transform duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-blood"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-surface">
        {poster ? (
          <Image
            src={poster}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-80 transition-opacity group-hover:opacity-100"
              style={{
                background: `linear-gradient(160deg, ${hueFromId(film.id)} 0%, #1a1614 70%)`,
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
              <span className="font-[family-name:var(--font-display)] text-5xl text-cream/90 md:text-6xl">
                {initial}
              </span>
              <span className="text-xs tracking-[0.2em] text-cream/50">
                {film.year}
              </span>
            </div>
          </>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/90 to-transparent" />
      </div>
      <div className="mt-3 space-y-1">
        <h2 className="font-[family-name:var(--font-display)] text-lg leading-tight text-cream group-hover:text-blood">
          {film.title}
        </h2>
        <p className="text-xs text-muted">
          {film.tags.slice(0, 3).map(tagLabel).join(" · ")}
        </p>
      </div>
    </Link>
  );
}

function hueFromId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * 17) % 360;
  return `hsl(${h} 28% 22%)`;
}
