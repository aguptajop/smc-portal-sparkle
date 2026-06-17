import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import { products } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Pin } from "lucide-react";

export const Route = createFileRoute("/analyst/commentary")({
  head: () => ({
    meta: [
      { title: "Publish commentary — SMC Pulse Analyst" },
      {
        name: "description",
        content: "Publish a morning note, market outlook or critical research update.",
      },
    ],
  }),
  component: Commentary,
});

const TYPES = ["Morning Note", "Market Outlook", "Critical Research Update"] as const;

function Commentary() {
  const [type, setType] = useState<(typeof TYPES)[number]>("Morning Note");
  const [pinned, setPinned] = useState(false);
  const [productId, setProductId] = useState(products[0]!.id);

  return (
    <PortalShell portal="analyst" title="Publish commentary">
      <PageHeader
        title="Publish commentary"
        subtitle="Reach all subscribers of the selected product."
      />

      <SectionLabel>Product</SectionLabel>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {products
          .filter((p) => p.subscribed)
          .map((p) => (
            <button
              key={p.id}
              onClick={() => setProductId(p.id)}
              className={cn(
                "rounded-md border px-3 py-2 text-left text-[12px]",
                productId === p.id
                  ? "border-[var(--smc-blue)] bg-accent text-[var(--smc-blue)]"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {p.name}
            </button>
          ))}
      </div>

      <SectionLabel>Commentary type</SectionLabel>
      <div className="grid gap-2 sm:grid-cols-3">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={cn(
              "rounded-md border bg-card px-3 py-2 text-[12px] font-semibold",
              type === t
                ? "border-[var(--smc-teal)] text-[var(--smc-blue)] ring-1 ring-[var(--smc-teal)]/30"
                : "border-border text-muted-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <SectionLabel>Content</SectionLabel>
      <div className="space-y-3 rounded-lg border border-border bg-card p-4">
        <input
          placeholder="Headline"
          className="w-full border-b border-border bg-transparent pb-2 text-[16px] font-semibold outline-none placeholder:text-muted-foreground/70 focus:border-[var(--smc-teal)]"
        />
        <textarea
          rows={7}
          placeholder="Write the commentary. Keep it tight, opinionated and actionable."
          className="w-full rounded-md border border-border bg-background p-3 text-[13px] outline-none placeholder:text-muted-foreground/70 focus:border-[var(--smc-teal)]"
        />
        <label className="flex items-center gap-2 text-[12px] text-foreground">
          <input
            type="checkbox"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
            className="size-4 accent-[var(--smc-blue)]"
          />
          <Pin className="size-3.5 text-[var(--smc-teal)]" />
          Pin to product (max 1 pinned at a time)
        </label>
      </div>

      <div className="sticky bottom-16 z-30 mt-6 -mx-4 border-t border-border bg-card/95 px-4 py-3 backdrop-blur lg:bottom-0">
        <div className="mx-auto flex max-w-5xl items-center justify-end gap-2">
          <button className="rounded-md border border-border bg-card px-3 py-2 text-[13px] font-medium hover:bg-secondary">
            Save draft
          </button>
          <button className="rounded-md bg-[var(--smc-blue)] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[var(--smc-blue-dark)]">
            Publish commentary
          </button>
        </div>
      </div>
    </PortalShell>
  );
}