import type { Film, FilterState } from "@/data/types";

export function emptyFilter(): FilterState {
  return { include: [], groups: [], exclude: [] };
}

/** Add one quiz answer: its `include` tags become an OR group. */
export function mergeAnswer(
  state: FilterState,
  include: string[] = [],
  exclude: string[] = [],
): FilterState {
  const groups =
    include.length > 0 ? [...state.groups, [...include]] : state.groups;
  const nextExclude = [...new Set([...state.exclude, ...exclude])];
  return {
    include: state.include,
    groups,
    exclude: nextExclude,
  };
}

export function toggleInclude(state: FilterState, tag: string): FilterState {
  const has = state.include.includes(tag);
  const include = has
    ? state.include.filter((t) => t !== tag)
    : [...state.include.filter((t) => t !== tag), tag];
  const exclude = state.exclude.filter((t) => t !== tag);
  return { ...state, include, exclude };
}

function groupScore(film: Film, groups: string[][]): number {
  return groups.filter((group) =>
    group.some((tag) => film.tags.includes(tag)),
  ).length;
}

/**
 * Hard excludes + sidebar AND.
 * Quiz groups are scored: prefer films matching ≥ half the groups;
 * if none, fall back to the best available score so the quiz never dead-ends.
 */
export function filterFilms(films: Film[], state: FilterState): Film[] {
  const base = films.filter((film) => {
    if (state.exclude.some((t) => film.tags.includes(t))) return false;
    return state.include.every((t) => film.tags.includes(t));
  });

  if (state.groups.length === 0) return base;

  const scored = base.map((film) => ({
    film,
    score: groupScore(film, state.groups),
  }));

  const threshold = Math.max(1, Math.ceil(state.groups.length * 0.5));
  let matched = scored.filter((s) => s.score >= threshold);

  if (matched.length === 0) {
    const best = Math.max(0, ...scored.map((s) => s.score));
    if (best === 0) return [];
    matched = scored.filter((s) => s.score === best);
  }

  return matched
    .sort((a, b) => b.score - a.score || b.film.year - a.film.year)
    .map((s) => s.film);
}

export function hasActiveFilters(state: FilterState): boolean {
  return (
    state.include.length > 0 ||
    state.groups.length > 0 ||
    state.exclude.length > 0
  );
}
