import filmsData from "./films.json";
import type { Film } from "./types";

export const films = filmsData as Film[];

export function getFilm(id: string): Film | undefined {
  return films.find((f) => f.id === id);
}
