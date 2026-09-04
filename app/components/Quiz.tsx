"use client";

import type { QuizQuestion } from "@/data/types";

type Props = {
  question: QuizQuestion;
  index: number;
  total: number;
  selected: string[];
  onToggle: (answerId: string) => void;
  onNext: () => void;
  canNext: boolean;
};

export function Quiz({
  question,
  index,
  total,
  selected,
  onToggle,
  onNext,
  canNext,
}: Props) {
  return (
    <section className="animate-fade mx-auto w-full max-w-2xl">
      <p className="text-xs tracking-[0.25em] uppercase text-muted">
        Question {index + 1} / {total}
      </p>
      <div className="mt-3 h-px w-full bg-line">
        <div
          className="h-px bg-blood transition-all duration-500"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>
      <h1 className="mt-8 font-[family-name:var(--font-display)] text-3xl leading-snug text-cream md:text-4xl">
        {question.prompt}
      </h1>
      {question.multi && (
        <p className="mt-2 text-sm text-muted">Plusieurs réponses possibles.</p>
      )}
      <ul className="mt-8 space-y-3">
        {question.answers.map((answer) => {
          const active = selected.includes(answer.id);
          return (
            <li key={answer.id}>
              <button
                type="button"
                onClick={() => onToggle(answer.id)}
                className={`w-full border px-5 py-4 text-left text-base transition-colors ${
                  active
                    ? "border-blood bg-blood/20 text-cream"
                    : "border-line bg-surface/60 text-muted hover:border-muted hover:text-cream"
                }`}
              >
                {answer.label}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-10">
        <button
          type="button"
          disabled={!canNext}
          onClick={onNext}
          className="bg-blood px-7 py-3.5 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-blood-dim disabled:cursor-not-allowed disabled:opacity-40"
        >
          {index + 1 === total ? "Voir les films" : "Suivant"}
        </button>
      </div>
    </section>
  );
}
