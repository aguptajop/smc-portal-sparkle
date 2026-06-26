import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import { EmptyView } from "@/components/pulse/states";
import { globalSearch, recentSearches } from "@/lib/pulse-data";
import { Search as SearchIcon, X } from "lucide-react";
import { StatusChip } from "@/components/pulse/status-chip";

export const Route = createFileRoute("/client/search")({
  head: () => ({ meta: [{ title: "Search — SMC Pulse" }] }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "recs" | "commentary" | "reports" | "ipo" | "products">("all");
  const results = useMemo(() => globalSearch(q), [q]);
  const total = results.recs.length + results.commentaries.length + results.products.length + results.reports.length + results.ipos.length;

  return (
    <PortalShell portal="client">
      <PageHeader title="Search" subtitle="Recommendations, commentary, reports, IPOs and products" />

      <div className="flex items-center rounded-md border border-input bg-card focus-within:ring-2 focus-within:ring-[var(--smc-teal)]/40">
        <span className="grid size-10 place-items-center text-muted-foreground"><SearchIcon className="size-4" /></span>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. RELIANCE, Banking outlook, NIFTY range"
          className="h-10 flex-1 bg-transparent text-[14px] outline-none"
        />
        {q && (
          <button onClick={() => setQ("")} className="grid size-10 place-items-center text-muted-foreground hover:text-foreground" aria-label="Clear">
            <X className="size-4" />
          </button>
        )}
      </div>

      {!q && (
        <>
          <SectionLabel>Recent searches</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((s) => (
              <button
                key={s}
                onClick={() => setQ(s)}
                className="rounded-md border border-border bg-card px-3 py-1.5 text-[12px] text-foreground hover:border-[var(--smc-teal)]/40"
              >
                {s}
              </button>
            ))}
          </div>
          <SectionLabel hint="Power tip">Search syntax</SectionLabel>
          <ul className="grid gap-2 text-[12px] text-muted-foreground sm:grid-cols-2">
            <li><kbd className="rounded bg-secondary px-1.5 py-0.5 text-foreground">product:techno-funda</kbd> — limit to a product</li>
            <li><kbd className="rounded bg-secondary px-1.5 py-0.5 text-foreground">status:active</kbd> — only live recommendations</li>
            <li><kbd className="rounded bg-secondary px-1.5 py-0.5 text-foreground">since:7d</kbd> — recent updates</li>
            <li><kbd className="rounded bg-secondary px-1.5 py-0.5 text-foreground">type:commentary</kbd> — only commentary</li>
          </ul>
        </>
      )}

      {q && (
        <>
          <div className="mb-3 mt-4 flex flex-wrap items-center gap-1.5">
            {(
              [
                ["all", `All (${total})`],
                ["recs", `Recommendations (${results.recs.length})`],
                ["commentary", `Commentary (${results.commentaries.length})`],
                ["reports", `Reports (${results.reports.length})`],
                ["ipo", `IPO (${results.ipos.length})`],
                ["products", `Products (${results.products.length})`],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setFilter(k as typeof filter)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${
                  filter === k ? "bg-[var(--smc-blue)] text-white" : "bg-secondary text-muted-foreground hover:bg-accent"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {total === 0 ? (
            <EmptyView title="No matches" hint="Try a different keyword or remove filters." />
          ) : (
            <div className="space-y-5">
              {(filter === "all" || filter === "recs") && results.recs.length > 0 && (
                <Group title="Recommendations">
                  {results.recs.map((r) => (
                    <Link key={r.id} to={`/client/recommendation/${r.id}`} className="block rounded-lg border border-border bg-card p-3 hover:border-[var(--smc-teal)]/40">
                      <div className="flex items-center gap-2">
                        <StatusChip status={r.status} />
                        <span className="text-[14px] font-semibold text-foreground tabular">{r.instrument}</span>
                      </div>
                      <p className="mt-1 text-[12px] text-muted-foreground">{r.latestAction}</p>
                    </Link>
                  ))}
                </Group>
              )}
              {(filter === "all" || filter === "commentary") && results.commentaries.length > 0 && (
                <Group title="Commentary">
                  {results.commentaries.map((c) => (
                    <Link key={c.id} to={`/client/product/${c.productId}`} className="block rounded-lg border border-border bg-card p-3 hover:border-[var(--smc-teal)]/40">
                      <p className="text-[11px] uppercase tracking-wider text-[var(--smc-blue)] font-semibold">{c.type}</p>
                      <p className="text-[14px] font-semibold text-foreground">{c.title}</p>
                    </Link>
                  ))}
                </Group>
              )}
              {(filter === "all" || filter === "reports") && results.reports.length > 0 && (
                <Group title="Reports">
                  {results.reports.map((r) => (
                    <Link key={r.id} to="/client/reports" className="block rounded-lg border border-border bg-card p-3 hover:border-[var(--smc-teal)]/40">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{r.type}</p>
                      <p className="text-[14px] font-semibold text-foreground">{r.title}</p>
                    </Link>
                  ))}
                </Group>
              )}
              {(filter === "all" || filter === "ipo") && results.ipos.length > 0 && (
                <Group title="IPO / OFS">
                  {results.ipos.map((i) => (
                    <Link key={i.id} to="/client/ipo" className="block rounded-lg border border-border bg-card p-3 hover:border-[var(--smc-teal)]/40">
                      <p className="text-[14px] font-semibold text-foreground">{i.name}</p>
                      <p className="text-[12px] text-muted-foreground tabular">{i.priceBand} · Lot {i.lotSize}</p>
                    </Link>
                  ))}
                </Group>
              )}
              {(filter === "all" || filter === "products") && results.products.length > 0 && (
                <Group title="Products">
                  {results.products.map((p) => (
                    <Link key={p.id} to={`/client/product/${p.id}`} className="block rounded-lg border border-border bg-card p-3 hover:border-[var(--smc-teal)]/40">
                      <p className="text-[14px] font-semibold text-foreground">{p.name}</p>
                      <p className="text-[12px] text-muted-foreground">{p.tagline}</p>
                    </Link>
                  ))}
                </Group>
              )}
            </div>
          )}
        </>
      )}
    </PortalShell>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{title}</h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}