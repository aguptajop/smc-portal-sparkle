import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import { activityFeed, commentaries, relativeTime } from "@/lib/mock-data";
import { CommentaryCard } from "@/components/pulse/cards";
import { DirectionTag, StatusChip } from "@/components/pulse/status-chip";

export const Route = createFileRoute("/client/activity")({
  head: () => ({
    meta: [
      { title: "Activity — SMC Pulse" },
      {
        name: "description",
        content: "Chronological feed of recommendation updates and commentary across your subscribed products.",
      },
      { property: "og:title", content: "SMC Pulse — Activity Center" },
      { property: "og:description", content: "Every research update, in order." },
    ],
  }),
  component: ActivityCenter,
});

function ActivityCenter() {
  const feed = activityFeed();
  const pinnedComm = commentaries.filter((c) => c.pinned);

  return (
    <PortalShell portal="client" title="Activity">
      <PageHeader title="Activity center" subtitle="Everything that changed, in order." />

      {pinnedComm.length > 0 && (
        <>
          <SectionLabel>Pinned commentary</SectionLabel>
          <div className="space-y-3">
            {pinnedComm.map((c) => (
              <CommentaryCard key={c.id} c={c} />
            ))}
          </div>
        </>
      )}

      <SectionLabel hint={`${feed.length} events`}>Recent updates</SectionLabel>
      <ol className="relative space-y-3">
        {feed.map((item, i) => (
          <li key={i}>
            <Link
              to={`/client/recommendation/${item.rec.id}`}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-[var(--smc-teal)]/40"
            >
              <div className="mt-1 size-2 shrink-0 rounded-full bg-[var(--smc-teal)]" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <DirectionTag dir={item.rec.direction} />
                  <span className="truncate text-[13px] font-semibold text-foreground tabular">
                    {item.rec.instrument}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    · {relativeTime(item.at)}
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] text-foreground/90">{item.update.label}</p>
                {item.update.detail && (
                  <p className="text-[12px] text-muted-foreground">{item.update.detail}</p>
                )}
              </div>
              <StatusChip status={item.rec.status} />
            </Link>
          </li>
        ))}
      </ol>
    </PortalShell>
  );
}