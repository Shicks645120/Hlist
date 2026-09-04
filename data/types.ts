export type Film = {
  id: string;
  title: string;
  year: number;
  synopsis: string;
  tags: string[];
  tmdbId?: number;
  posterPath?: string | null;
};

export type TagGroup =
  | "subgenre"
  | "tone"
  | "threat"
  | "setting"
  | "intensity"
  | "pace";

export type TagDef = {
  id: string;
  label: string;
  group: TagGroup;
};

export type QuizAnswer = {
  id: string;
  label: string;
  include?: string[];
  exclude?: string[];
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  multi: boolean;
  answers: QuizAnswer[];
};

export type FilterState = {
  /** Tags from the sidebar — film must have all (AND). */
  include: string[];
  /** Quiz preferences — each group is OR; films are scored across groups. */
  groups: string[][];
  exclude: string[];
};
