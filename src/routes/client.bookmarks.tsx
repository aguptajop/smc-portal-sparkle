import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import { EmptyView } from "@/components/pulse/states";
import { bookmarks, reports, relativeTime } from "@/lib/pulse-data";
import { commentaries, recommendations } from "@/lib/mock-data";
import { Bookmark } from "lucide-react";
import { StatusChip } from "@/components/pulse/status-chip";

export const Route = createFileRoute("/client/bookmarks")({
  head: () => ({ meta: [{ title: "Bookmarks — SMC Pulse" }] }),
  component: BookmarksPage,
});

function BookmarksPage() {
  const recs = bookmarks
    .filter((b) => b.kind === "recommendation")
    .map((b) => ({ b, rec: recommendations.find((r) => r.id === b.refId) }))
    .filter((x) => x.rec);
  const coms = bookmarks
    .filter((b) => b.kind === "commentary")
    .map((b) => ({ b, c: commentaries.find((c) => c.id === b.refId) }))
    .filter((x) => x.c);
  const reps = bookmarks
    .filter((b) => b.kind === "report")
    .map((b) => ({ b, r: reports.find((r) => r.id === b.refId) }))
    .filter((x) => x.r);

  const empty = recs.length + coms.length + reps.length === 0;

  return (
    <PortalShell portal="client">
      <PageHeader title="Saved" subtitle="Recommendations, commentary and reports you bookmarked" />
      {empty ? (
        <EmptyView title="Nothing saved yet" hint="Tap the bookmark icon on any item to save it for later." />
      ) : (
        <>
          {recs.length > 0 && (
            <>
              <SectionLabel>Recommendations</SectionLabel>
              <div className="space-y-2">
                {recs.map(({ b, rec }) => (
                  <Link key={b.id} to={`/client/recommendation/${rec!.id}`} className="block rounded-lg border border-border bg-card p-3 hover:border-[var(--smc-teal)]/40">
                    <div className="flex items-center gap-2">
                      <StatusChip status={rec!.status} />
                      <span className="text-[14px] font-semibold text-foreground tabular">{rec!.instrument}</span>
                      <span className="ml-auto text-[11px] text-muted-foreground">Saved {relativeTime(b.at)}</span>
                    </div>
                    <p className="mt-1 text-[12px] text-muted-foreground">{rec!.latestAction}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
          {coms.length > 0 && (
            <>
              <SectionLabel>Commentary</SectionLabel>
              <div className="space-y-2">
                {coms.map(({ b, c }) => (
                  <Link key={b.id} to={`/client/product/${c!.productId}`} className="block rounded-lg border border-border bg-card p-3 hover:border-[var(--smc-teal)]/40">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--smc-blue)]">{c!.type}</p>
                    <p className="text-[14px] font-semibold text-foreground">{c!.title}</p>
                    <p className="text-[11px] text-muted-foreground">Saved {relativeTime(b.at)}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
          {reps.length > 0 && (
            <>
              <SectionLabel>Reports</SectionLabel>
              <div className="space-y-2">
                {reps.map(({ b, r }) => (
                  <Link key={b.id} to="/client/reports" className="block rounded-lg border border-border bg-card p-3 hover:border-[var(--smc-teal)]/40">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{r!.type} · {r!.pages} pages</p>
                    <p className="text-[14px] font-semibold text-foreground">{r!.title}</p>
                    <p className="text-[11px] text-muted-foreground"><Bookmark className="inline size-3" /> Saved {relativeTime(b.at)}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </PortalShell>
  );
}