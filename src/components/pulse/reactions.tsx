import { useState } from "react";
import { Bookmark, ThumbsUp, MessageSquare, Share2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReactionBar({
  bookmarked: initial = false,
  liked: initialLiked = false,
  comments = 0,
  onBookmark,
}: {
  bookmarked?: boolean;
  liked?: boolean;
  comments?: number;
  onBookmark?: (next: boolean) => void;
}) {
  const [bookmarked, setBookmarked] = useState(initial);
  const [liked, setLiked] = useState(initialLiked);
  const [copied, setCopied] = useState(false);

  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border pt-3 text-[12px] text-muted-foreground">
      <button
        type="button"
        onClick={() => setLiked((v) => !v)}
        aria-pressed={liked}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-secondary",
          liked && "text-[var(--smc-blue)]",
        )}
      >
        <ThumbsUp className={cn("size-3.5", liked && "fill-current")} /> Helpful
      </button>
      <button
        type="button"
        onClick={() => {
          const next = !bookmarked;
          setBookmarked(next);
          onBookmark?.(next);
        }}
        aria-pressed={bookmarked}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-secondary",
          bookmarked && "text-[var(--smc-teal)]",
        )}
      >
        <Bookmark className={cn("size-3.5", bookmarked && "fill-current")} />
        {bookmarked ? "Saved" : "Save"}
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-secondary"
      >
        <MessageSquare className="size-3.5" /> {comments > 0 ? comments : "Note"}
      </button>
      <button
        type="button"
        onClick={async () => {
          try {
            if (typeof window !== "undefined" && navigator.clipboard) {
              await navigator.clipboard.writeText(window.location.href);
            }
          } catch {}
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="ml-auto inline-flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-secondary"
      >
        {copied ? <Check className="size-3.5 text-[var(--success)]" /> : <Share2 className="size-3.5" />}
        {copied ? "Copied" : "Share"}
      </button>
    </div>
  );
}