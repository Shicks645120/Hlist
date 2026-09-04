"use client";

import { useState } from "react";
import { QUESTIONS } from "@/data/questions";
import { films } from "@/data/films";
import type { FilterState } from "@/data/types";
import {
  emptyFilter,
  filterFilms,
  mergeAnswer,
  toggleInclude,
} from "@/lib/filter";
import { Quiz } from "./Quiz";
import { TagFilters } from "./TagFilters";
import { FilmGrid } from "./FilmGrid";

export function DiscoverExperience() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState<FilterState>(emptyFilter());

  const question = QUESTIONS[step];
  const results = filterFilms(films, filter);

  function toggleAnswer(answerId: string) {
    if (!question) return;
    if (question.multi) {
      const none = question.answers.find((a) => a.id === "none-extra");
      if (answerId === none?.id) {
        setSelected([answerId]);
        return;
      }
      setSelected((prev) => {
        const withoutNone = prev.filter((id) => id !== none?.id);
        return withoutNone.includes(answerId)
          ? withoutNone.filter((id) => id !== answerId)
          : [...withoutNone, answerId];
      });
    } else {
      setSelected([answerId]);
    }
  }

  function applySelectedAndAdvance() {
    if (!question || selected.length === 0) return;
    let next = filter;
    for (const id of selected) {
      const answer = question.answers.find((a) => a.id === id);
      if (!answer) continue;
      next = mergeAnswer(next, answer.include, answer.exclude);
    }
    setFilter(next);
    setSelected([]);
    if (step + 1 >= QUESTIONS.length) {
      setDone(true);
    } else {
      setStep(step + 1);
    }
  }

  function restart() {
    setStep(0);
    setDone(false);
    setSelected([]);
    setFilter(emptyFilter());
  }

  if (!done && question) {
    return (
      <Quiz
        question={question}
        index={step}
        total={QUESTIONS.length}
        selected={selected}
        onToggle={toggleAnswer}
        onNext={applySelectedAndAdvance}
        canNext={selected.length > 0}
      />
    );
  }

  return (
    <div className="animate-fade">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-cream md:text-4xl">
            Tes films
          </h1>
          <p className="mt-2 text-muted">
            {results.length} résultat{results.length === 1 ? "" : "s"} sur{" "}
            {films.length}
            {filter.groups.length > 0
              ? " · classés par pertinence"
              : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={restart}
          className="text-sm text-muted underline-offset-4 hover:text-cream hover:underline"
        >
          Recommencer le questionnaire
        </button>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,16rem)_1fr]">
        <TagFilters
          filter={filter}
          onToggle={(tag) => setFilter((f) => toggleInclude(f, tag))}
          onClear={() => setFilter(emptyFilter())}
        />
        <FilmGrid films={results} />
      </div>
    </div>
  );
}
