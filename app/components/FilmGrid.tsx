import type { Film } from "@/data/types";
import { FilmCard } from "./FilmCard";

export function FilmGrid({ films }: { films: Film[] }) {
  if (films.length === 0) {
    return (
      <p className="animate-fade py-16 text-center text-muted">
        Aucun film ne correspond. Retire quelques tags ou recommence le
        questionnaire.
      </p>
    );
  }

  return (
    <ul className="animate-fade grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {films.map((film) => (
        <li key={film.id}>
          <FilmCard film={film} />
        </li>
      ))}
    </ul>
  );
}
