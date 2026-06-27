import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { actionRequiredCount, activeCount, products } from "@/lib/mock-data";

export type ProductScope = string | "all";

/**
 * Header product switcher.
 * - 1 subscribed product → static label (no dropdown)
 * - >1 → dropdown with action / active counts and "All Products" option
 */
export function ProductSwitcher({
  value,
  onChange,
}: {
  value: ProductScope;
  onChange: (next: ProductScope) => void;
}) {
  const subscribed = products.filter((p) => p.subscribed);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (subscribed.length === 0) {
    return (
      <span className="inline-flex items-center rounded-md border border-border bg-card px-3 py-1.5 text-[12px] font-semibold text-muted-foreground">
        No active products
      </span>
    );
  }

  const current =
    value === "all"
      ? { name: "All Products", id: "all" as const }
      : subscribed.find((p) => p.id === value) ?? subscribed[0];
  const single = subscribed.length === 1;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !single && setOpen((v) => !v)}
        className={cn(
          "inline-flex max-w-[220px] items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-[13px] font-semibold text-foreground",
          !single && "hover:border-[var(--smc-teal)]/40",
        )}
      >
        <span className="truncate">{current.name}</span>
        {!single && <ChevronDown className={cn("size-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />}
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute left-0 z-50 mt-1.5 w-[260px] rounded-lg border border-border bg-card p-1 shadow-[0_8px_24px_rgba(0,58,112,0.10)]"
        >
          {subscribed.map((p) => {
            const ar = actionRequiredCount(p.id);
            const act = activeCount(p.id);
            const selected = value === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(p.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-[13px] transition-colors",
                  selected ? "bg-accent text-[var(--smc-blue)]" : "text-foreground hover:bg-secondary",
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  {selected ? (
                    <Check className="size-3.5 text-[var(--smc-teal)]" />
                  ) : (
                    <span className="size-3.5" />
                  )}
                  <span className="truncate font-medium">{p.name}</span>
                  {ar > 0 && (
                    <span className="size-1.5 shrink-0 rounded-full bg-[var(--warning)]" aria-label={`${ar} action items`} />
                  )}
                </span>
                <span className="shrink-0 text-[11px] text-muted-foreground tabular">
                  {ar > 0 ? `${ar} action` : `${act} active`}
                </span>
              </button>
            );
          })}
          <div className="my-1 border-t border-border" />
          <button
            type="button"
            role="option"
            aria-selected={value === "all"}
            onClick={() => {
              onChange("all");
              setOpen(false);
            }}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[13px]",
              value === "all" ? "bg-accent text-[var(--smc-blue)]" : "text-foreground hover:bg-secondary",
            )}
          >
            {value === "all" ? <Check className="size-3.5 text-[var(--smc-teal)]" /> : <span className="size-3.5" />}
            <span className="font-medium">All Products</span>
            <span className="ml-auto text-[11px] text-muted-foreground">Cross-product view</span>
          </button>
        </div>
      )}
    </div>
  );
}

/** Desktop sticky pill bar variant (Chapter 31.3). */
export function ProductSwitcherBar({
  value,
  onChange,
}: {
  value: ProductScope;
  onChange: (next: ProductScope) => void;
}) {
  const subscribed = products.filter((p) => p.subscribed);
  if (subscribed.length === 0) return null;
  const opts: { id: ProductScope; name: string; ar?: number }[] = [
    ...subscribed.map((p) => ({ id: p.id, name: p.name, ar: actionRequiredCount(p.id) })),
    { id: "all", name: "All Products" },
  ];
  return (
    <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
      {opts.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={String(o.id)}
            onClick={() => onChange(o.id)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors",
              active
                ? "bg-[var(--smc-teal)] text-white"
                : "border border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {o.name}
            {o.ar ? (
              <span className="size-1.5 rounded-full bg-[var(--warning)]" aria-label={`${o.ar} action items`} />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}