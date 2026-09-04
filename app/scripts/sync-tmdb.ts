/**
 * Sync Hlist catalogue with TMDB:
 * - Enrich existing films with tmdbId + posterPath (keep synopsis/tags)
 * - Import popular horror movies (genre 27) with keyword → tag mapping
 *
 * Usage: bun run sync:tmdb
 * Requires TMDB_API_KEY in .env.local
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type Film = {
  id: string;
  title: string;
  year: number;
  synopsis: string;
  tags: string[];
  tmdbId?: number;
  posterPath?: string | null;
};

type TmdbMovie = {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  release_date?: string;
  poster_path: string | null;
  genre_ids?: number[];
};

type TmdbSearchResponse = {
  results: TmdbMovie[];
};

type TmdbDiscoverResponse = {
  results: TmdbMovie[];
  total_pages: number;
};

type TmdbKeywordsResponse = {
  keywords: { id: number; name: string }[];
};

const ROOT = resolve(import.meta.dir, "..");
const FILMS_PATH = resolve(ROOT, "data/films.json");
const BASE = "https://api.themoviedb.org/3";
const HORROR_GENRE = 27;
/** Pages discover (~20 films/page). 8 pages ≈ 160 résultats bruts. */
const DISCOVER_PAGES = 8;
const VOTE_COUNT_MIN = 200;
/** Taille minimale du catalogue après sync. */
const TARGET_TOTAL = 150;

/** TMDB keyword name (lowercase) → Hlist tag id */
const KEYWORD_TO_TAG: Record<string, string> = {
  slasher: "slasher",
  "serial killer": "slasher",
  zombie: "zombie",
  zombies: "zombie",
  undead: "zombie",
  vampire: "vampire",
  vampires: "vampire",
  possession: "possession",
  possessed: "possession",
  demon: "demon",
  demonic: "demon",
  devil: "demon",
  exorcism: "possession",
  "found footage": "found-footage",
  "body horror": "body-horror",
  "folk horror": "folk",
  "haunted house": "haunting",
  haunting: "haunting",
  ghost: "ghost",
  ghosts: "ghost",
  witchcraft: "witch",
  witch: "witch",
  witches: "witch",
  comedy: "comedie-horreur",
  "horror comedy": "comedie-horreur",
  gore: "gore",
  gory: "gore",
  splatter: "gore",
  supernatural: "supernatural",
  psychological: "psychologique",
  "psychological horror": "psychologique",
  creature: "creature",
  monster: "monster",
  monsters: "monster",
  alien: "alien",
  cult: "cult",
  survival: "survival",
  anthology: "anthology",
  cosmic: "cosmic",
  lovecraftian: "cosmic",
  satire: "satire",
  paranoia: "paranoid",
  suburb: "suburbia",
  suburban: "suburbia",
  rural: "rural",
  countryside: "rural",
  isolation: "isolated",
  isolated: "isolated",
  japan: "japan",
  japanese: "japan",
  italy: "italy",
  giallo: "italy",
  space: "space",
  mask: "mask",
  "slow burn": "slow-burn",
};

function loadEnvLocal() {
  const envPath = resolve(ROOT, ".env.local");
  try {
    const raw = readFileSync(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (!(key in process.env) || !process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env.local may be missing; rely on process.env
  }
}

function requireApiKey(): string {
  loadEnvLocal();
  const key = process.env.TMDB_API_KEY?.trim();
  if (!key || key === "your_tmdb_v3_api_key_here") {
    console.error(
      "TMDB_API_KEY manquante. Ajoute-la dans app/.env.local\n" +
        "Obtiens une clé (gratuit) : https://www.themoviedb.org/settings/api",
    );
    process.exit(1);
  }
  return key;
}

async function tmdbGet<T>(
  path: string,
  apiKey: string,
  params: Record<string, string | number | boolean> = {},
): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("api_key", apiKey);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`TMDB ${path} → ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

function slugify(title: string, year: number): string {
  const base = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "film"}-${year}`;
}

function normalizeTitle(t: string): string {
  return t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function yearFromDate(date?: string): number | null {
  if (!date || date.length < 4) return null;
  const y = Number(date.slice(0, 4));
  return Number.isFinite(y) ? y : null;
}

function eraTag(year: number): string {
  return year < 2000 ? "classic" : "modern";
}

function mapKeywordsToTags(keywords: string[], year: number): string[] {
  const tags = new Set<string>();
  for (const raw of keywords) {
    const name = raw.toLowerCase().trim();
    const tag = KEYWORD_TO_TAG[name];
    if (tag) tags.add(tag);
  }
  tags.add(eraTag(year));
  if (tags.size <= 1) {
    tags.add("supernatural");
  }
  return [...tags];
}

function pickSearchMatch(
  film: Film,
  results: TmdbMovie[],
): TmdbMovie | undefined {
  const want = normalizeTitle(film.title);
  const sameYear = results.filter(
    (r) => yearFromDate(r.release_date) === film.year,
  );
  const pool = sameYear.length > 0 ? sameYear : results;

  const exact = pool.find(
    (r) =>
      normalizeTitle(r.title) === want ||
      normalizeTitle(r.original_title ?? "") === want,
  );
  if (exact) return exact;

  return pool.find((r) => {
    const t = normalizeTitle(r.title);
    const o = normalizeTitle(r.original_title ?? "");
    return t.includes(want) || want.includes(t) || o.includes(want) || want.includes(o);
  });
}

async function enrichExisting(films: Film[], apiKey: string): Promise<Film[]> {
  const out: Film[] = [];
  let matched = 0;

  for (const film of films) {
    if (film.tmdbId && film.posterPath) {
      out.push(film);
      matched++;
      continue;
    }

    try {
      const data = await tmdbGet<TmdbSearchResponse>("/search/movie", apiKey, {
        query: film.title,
        year: film.year,
        language: "fr-FR",
        include_adult: false,
      });
      const match = pickSearchMatch(film, data.results ?? []);
      if (match) {
        matched++;
        out.push({
          ...film,
          tmdbId: match.id,
          posterPath: match.poster_path,
        });
        console.log(`  ✓ ${film.title} (${film.year}) → TMDB ${match.id}`);
      } else {
        out.push(film);
        console.warn(`  ✗ pas de match: ${film.title} (${film.year})`);
      }
    } catch (err) {
      out.push(film);
      console.warn(`  ✗ erreur search ${film.title}:`, err);
    }

    await sleep(50);
  }

  console.log(`Enrichissement: ${matched}/${films.length} matchés`);
  return out;
}

async function fetchHorrorDiscover(
  apiKey: string,
  alreadyHave: number,
): Promise<TmdbMovie[]> {
  const movies: TmdbMovie[] = [];
  const needed = Math.max(0, TARGET_TOTAL - alreadyHave);
  // Extra buffer for duplicates / missing year / already in catalogue
  const wantRaw = needed + alreadyHave + 40;
  const maxPages = Math.max(DISCOVER_PAGES, Math.ceil(wantRaw / 20));

  for (let page = 1; page <= maxPages; page++) {
    const data = await tmdbGet<TmdbDiscoverResponse>("/discover/movie", apiKey, {
      with_genres: HORROR_GENRE,
      sort_by: "popularity.desc",
      "vote_count.gte": VOTE_COUNT_MIN,
      language: "fr-FR",
      include_adult: false,
      page,
    });
    movies.push(...(data.results ?? []));
    if (page >= (data.total_pages ?? page)) break;
    await sleep(50);
  }
  return movies;
}

async function importNewHorror(
  existing: Film[],
  apiKey: string,
): Promise<Film[]> {
  const knownTmdb = new Set(
    existing.map((f) => f.tmdbId).filter((id): id is number => id != null),
  );
  const knownIds = new Set(existing.map((f) => f.id));

  const discovered = await fetchHorrorDiscover(apiKey, existing.length);
  const candidates = discovered.filter((m) => !knownTmdb.has(m.id));
  console.log(
    `Discover: ${discovered.length} films, ${candidates.length} nouveaux (cible catalogue ≥ ${TARGET_TOTAL})`,
  );

  const imported: Film[] = [];

  for (const movie of candidates) {
    if (existing.length + imported.length >= TARGET_TOTAL) break;

    const year = yearFromDate(movie.release_date);
    if (!year) continue;

    let keywords: string[] = [];
    try {
      const kw = await tmdbGet<TmdbKeywordsResponse>(
        `/movie/${movie.id}/keywords`,
        apiKey,
      );
      keywords = (kw.keywords ?? []).map((k) => k.name);
    } catch {
      // keep empty keywords
    }

    let id = slugify(movie.title || movie.original_title || "film", year);
    if (knownIds.has(id)) {
      id = `${id}-${movie.id}`;
    }
    knownIds.add(id);

    const synopsis =
      movie.overview?.trim() ||
      "Synopsis indisponible — film d'horreur importé depuis TMDB.";

    const film: Film = {
      id,
      title: movie.title || movie.original_title || `Film ${movie.id}`,
      year,
      synopsis,
      tags: mapKeywordsToTags(keywords, year),
      tmdbId: movie.id,
      posterPath: movie.poster_path,
    };
    imported.push(film);
    knownTmdb.add(movie.id);
    console.log(`  + ${film.title} (${film.year}) [${film.tags.join(", ")}]`);
    await sleep(50);
  }

  console.log(`Import: ${imported.length} nouveaux films`);
  return imported;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const apiKey = requireApiKey();
  const films = JSON.parse(readFileSync(FILMS_PATH, "utf8")) as Film[];
  console.log(`Catalogue actuel: ${films.length} films\n`);

  console.log("— Enrichissement des films existants —");
  const enriched = await enrichExisting(films, apiKey);

  console.log("\n— Import horreur populaire (genre 27) —");
  const newcomers = await importNewHorror(enriched, apiKey);

  const merged = [...enriched, ...newcomers];
  writeFileSync(FILMS_PATH, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
  console.log(`\nÉcrit ${merged.length} films → data/films.json`);
  if (merged.length < TARGET_TOTAL) {
    console.warn(
      `Attention: catalogue à ${merged.length} < cible ${TARGET_TOTAL}. Relance ou baisse VOTE_COUNT_MIN.`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
