import { useState } from "react";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Engagement bar per spec §6 — 5 fixed emoji reactions with optimistic
 * toggle + a single bookmark toggle on the right.
 * One reaction per user; tapping a different emoji replaces the previous one.
 */
const REACTIONS = [
  { id: "helpful", emoji: "👍", label: "Helpful", count: 45 },
  { id: "fire", emoji: "🔥", label: "Hot take", count: 23 },
  { id: "trend", emoji: "📈", label: "Bullish", count: 67 },
  { id: "idea", emoji: "💡", label: "Insightful", count: 12 },
  { id: "target", emoji: "🎯", label: "On target", count: 8 },
] as const;

export function ReactionBar({
  initialReaction,
  initialBookmarked = false,
}: {
  initialReaction?: (typeof REACTIONS)[number]["id"];
  initialBookmarked?: boolean;
}) {
  const [active, setActive] = useState<string | null>(initialReaction ?? null);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  return (
    <div className="mt-4 flex flex-wrap items-center gap-1 border-t border-border pt-3">
      {REACTIONS.map((r) => {
        const isActive = active === r.id;
        const count = r.count + (isActive ? 1 : 0);
        return (
          <button
            key={r.id}
            type="button"
            aria-pressed={isActive}
            aria-label={`${r.label} — ${count}`}
            onClick={() => setActive((cur) => (cur === r.id ? null : r.id))}
            className={cn(
              "inline-flex min-h-9 min-w-9 items-center gap-1 rounded-md px-2 py-1 text-[12px] font-semibold transition-colors",
              isActive
                ? "bg-[var(--accent)] text-[var(--smc-blue)] ring-1 ring-[var(--smc-teal)]/40"
                : "text-muted-foreground hover:bg-secondary",
            )}
          >
            <span className="text-[14px] leading-none">{r.emoji}</span>
            <span className="tabular">{count}</span>
          </button>
        );
      })}
      <button
        type="button"
        aria-pressed={bookmarked}
        aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
        onClick={() => setBookmarked((v) => !v)}
        className={cn(
          "ml-auto inline-flex min-h-9 min-w-9 items-center gap-1.5 rounded-md px-2 py-1 text-[12px] font-medium transition-colors",
          bookmarked ? "text-[var(--smc-teal)]" : "text-muted-foreground hover:bg-secondary",
        )}
      >
        <Bookmark className={cn("size-4", bookmarked && "fill-current")} />
        {bookmarked ? "Saved" : "Save"}
      </button>
    </div>
  );
}