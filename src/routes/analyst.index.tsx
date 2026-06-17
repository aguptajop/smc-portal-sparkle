import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import { recommendations, relativeTime, commentaries } from "@/lib/mock-data";
import { DirectionTag, StatusChip } from "@/components/pulse/status-chip";
import { FileEdit, PlusCircle, Send } from "lucide-react";

export const Route = createFileRoute("/analyst/")({
  head: () => ({
    meta: [
      { title: "Research Queue — SMC Pulse Analyst" },
      {
        name: "description",
        content: "Recommendations that need analyst attention, active drafts and recent publishes.",
      },
      { property: "og:title", content: "SMC Pulse — Analyst Queue" },
      { property: "og:description", content: "What to action, what is drafting, what was published." },
    ],
  }),
  component: AnalystHome,
});

function AnalystHome() {
  const queue = recommendations.filter(
    (r) => r.status === "ACTION_REQUIRED" || r.status === "ACTIVE" || r.status === "PARTIAL",
  );
  const recent = [...commentaries].sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
  );

  return (
    <PortalShell portal="analyst" title="Research Queue">
      <PageHeader
        title="Research desk"
        subtitle="Action items, drafts and recently published research."
        right={
          <Link
            to="/analyst/create"
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--smc-blue)] px-3 py-2 text-[12px] font-semibold text-white hover:bg-[var(--smc-blue-dark)]"
          >
            <PlusCircle className="size-4" /> New recommendation
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat k="Action queue" v={queue.filter((q) => q.status === "ACTION_REQUIRED").length} tone="warning" />
        <Stat k="Open positions" v={queue.length} />
        <Stat k="Published today" v={3} />
      </div>

      <SectionLabel hint="Highest priority first">Research attention queue</SectionLabel>
      <div className="space-y-3">
        {queue.map((rec) => (
          <Link
            key={rec.id}
            to={`/analyst/recommendation/${rec.id}`}
            className="block rounded-lg border border-border bg-card p-4 hover:border-[var(--smc-teal)]/40"
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <DirectionTag dir={rec.direction} />
                  <span className="truncate text-[15px] font-semibold tabular text-foreground">
                    {rec.instrument}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    · {rec.productId}
                  </span>
                </div>
                <p className="mt-2 text-[13px] text-foreground/90">
                  <span className="font-semibold text-[var(--smc-blue)]">Suggested:</span>{" "}
                  {rec.latestAction}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Updated {relativeTime(rec.updatedAt)}
                </p>
              </div>
              <StatusChip status={rec.status} />
            </div>
          </Link>
        ))}
      </div>

      <SectionLabel>Drafts</SectionLabel>
      <div className="space-y-2">
        {[
          { name: "TCS — swing buy setup", saved: "2 min ago" },
          { name: "Morning Note · 17 Jun", saved: "12 min ago" },
        ].map((d) => (
          <div
            key={d.name}
            className="flex items-center justify-between rounded-lg border border-dashed border-border bg-card px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-2">
              <FileEdit className="size-4 text-muted-foreground" />
              <span className="truncate text-[13px] font-medium text-foreground">{d.name}</span>
            </div>
            <span className="text-[11px] text-muted-foreground">Auto-saved · {d.saved}</span>
          </div>
        ))}
      </div>

      <SectionLabel>Recently published</SectionLabel>
      <div className="space-y-2">
        {recent.slice(0, 4).map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-foreground">{c.title}</p>
              <p className="text-[11px] text-muted-foreground">
                {c.type} · {relativeTime(c.publishedAt)}
              </p>
            </div>
            <Send className="size-4 text-muted-foreground" />
          </div>
        ))}
      </div>
    </PortalShell>
  );
}

function Stat({ k, v, tone }: { k: string; v: number; tone?: "warning" }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</p>
      <p
        className={`mt-1 text-[24px] font-bold tabular ${
          tone === "warning" ? "text-[var(--warning)]" : "text-foreground"
        }`}
      >
        {v}
      </p>
    </div>
  );
}