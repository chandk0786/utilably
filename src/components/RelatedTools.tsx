"use client";

import Link from "next/link";
import { toolRegistry, isToolIndexable, Tool } from "@/lib/tool-registry";

type Props = {
  /** current tool id like "pdf-editor" */
  currentToolId: string;
  /** optional override: how many related tools to show */
  limit?: number;
  /** optional heading text */
  title?: string;
};

function pickRelatedTools(current: Tool, limit: number) {
  const indexable = toolRegistry.filter(isToolIndexable);

  // 1) Same category tools first
  const sameCategory = indexable
    .filter((t) => t.id !== current.id && t.category === current.category)
    .sort((a, b) => b.functionalityScore - a.functionalityScore);

  // 2) If not enough, fill with trending tools
  const trending = indexable
    .filter((t) => t.id !== current.id && t.trending)
    .sort((a, b) => b.priority - a.priority);

  // 3) Fill with high score tools
  const highScore = indexable
    .filter((t) => t.id !== current.id)
    .sort((a, b) => b.functionalityScore - a.functionalityScore);

  const merged: Tool[] = [];
  const pushUnique = (list: Tool[]) => {
    for (const item of list) {
      if (merged.length >= limit) break;
      if (!merged.find((x) => x.id === item.id)) merged.push(item);
    }
  };

  pushUnique(sameCategory);
  pushUnique(trending);
  pushUnique(highScore);

  return merged.slice(0, limit);
}

export default function RelatedTools({
  currentToolId,
  limit = 6,
  title = "Related tools",
}: Props) {
  const current = toolRegistry.find((t) => t.id === currentToolId);
  if (!current) return null;

  const related = pickRelatedTools(current, limit);
  if (related.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <Link href="/tools" className="text-sm text-primary hover:underline">
          View all tools
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {related.map((tool) => (
          <Link
            key={tool.id}
            href={tool.path}
            className="rounded-xl border bg-card p-4 hover:shadow-sm transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{tool.name}</div>
                <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {tool.description}
                </div>
              </div>

              {tool.trending ? (
                <span className="shrink-0 rounded-full bg-amber-100 text-amber-800 border border-amber-200 px-2 py-1 text-xs font-medium">
                  Trending
                </span>
              ) : (
                <span className="shrink-0 rounded-full bg-green-100 text-green-800 border border-green-200 px-2 py-1 text-xs font-medium">
                  Functional
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
