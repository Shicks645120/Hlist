"use client";

import { TAGS, TAG_GROUP_LABELS, tagLabel } from "@/data/tags";
import type { FilterState, TagGroup } from "@/data/types";

const GROUPS: TagGroup[] = [
  "subgenre",
  "tone",
  "threat",
  "setting",
  "intensity",
  "pace",
];

type Props = {
  filter: FilterState;
  onToggle: (tag: string) => void;
  onClear: () => void;
};

export function TagFilters({ filter, onToggle, onClear }: Props) {
  return (
    <aside className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl text-cream">
            Affiner
          </h2>
          <p className="mt-1 text-sm text-muted">
            Clique un tag pour l&apos;ajouter ou le retirer.
          </p>
        </div>
        {(filter.include.length > 0 ||
          filter.groups.length > 0 ||
          filter.exclude.length > 0) && (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 text-xs tracking-wide text-muted underline-offset-2 hover:text-cream hover:underline"
          >
            Tout effacer
          </button>
        )}
      </div>

      {(filter.include.length > 0 || filter.groups.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {filter.include.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onToggle(id)}
              className="border border-blood bg-blood/25 px-3 py-1 text-xs text-cream"
            >
              {tagLabel(id)} ×
            </button>
          ))}
          {filter.groups.flatMap((group, gi) =>
            group.map((id) => (
              <span
                key={`g-${gi}-${id}`}
                className="border border-cream/20 bg-surface px-3 py-1 text-xs text-cream/80"
              >
                {tagLabel(id)}
              </span>
            )),
          )}
        </div>
      )}

      {filter.exclude.length > 0 && (
        <p className="text-xs text-muted">
          Exclus : {filter.exclude.map(tagLabel).join(", ")}
        </p>
      )}

      {GROUPS.map((group) => {
        const tags = TAGS.filter((t) => t.group === group);
        return (
          <div key={group}>
            <p className="mb-2 text-xs tracking-[0.2em] uppercase text-muted">
              {TAG_GROUP_LABELS[group]}
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const active = filter.include.includes(tag.id);
                const excluded = filter.exclude.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => onToggle(tag.id)}
                    className={`px-3 py-1 text-xs transition-colors ${
                      active
                        ? "bg-blood text-cream"
                        : excluded
                          ? "bg-line text-muted line-through"
                          : "bg-surface text-muted hover:text-cream"
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </aside>
  );
}
