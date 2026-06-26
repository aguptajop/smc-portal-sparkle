import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader, PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import { DirectionTag, StatusChip } from "@/components/pulse/status-chip";
import type { Recommendation } from "@/lib/mock-data";
import { recommendations, relativeTime } from "@/lib/mock-data";
import { ArrowLeft, History } from "lucide-react";
import { ReactionBar } from "@/components/pulse/reactions";

export const Route = createFileRoute("/client/recommendation/$id")({
  loader: ({ params }) => {
    const rec = recommendations.find((r) => r.id === params.id);
    if (!rec) throw notFound();
    return { rec };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.rec.instrument ?? "Recommendation"} — SMC Pulse` },
      {
        name: "description",
        content: `Full timeline and status for the ${loaderData?.rec.instrument ?? ""} research recommendation.`,
      },
    ],
  }),
  component: RecommendationDetail,
});

function RecommendationDetail() {
  const { rec } = Route.useLoaderData() as { rec: Recommendation };

  return (
    <PortalShell portal="client" title={rec.instrument}>
      <Link
        to={`/client/product/${rec.productId}`}
        className="mb-3 inline-flex items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to product
      </Link>

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <DirectionTag dir={rec.direction} />
          <h1 className="text-[20px] font-bold tabular text-foreground">{rec.instrument}</h1>
          <StatusChip status={rec.status} />
        </div>
        {rec.rationale && (
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/85">{rec.rationale}</p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3 text-[13px] sm:grid-cols-4">
          <Stat k="Entry" v={rec.entry} />
          <Stat k="Stop loss" v={rec.sl} tone="danger" />
          <Stat k="Target 1" v={rec.targets[0]} tone="success" />
          <Stat k="Target 2" v={rec.targets[1] ?? "—"} tone="success" />
        </div>

        <div className="mt-4 rounded-md bg-accent/60 px-3 py-2 text-[13px]">
          <span className="font-semibold text-[var(--smc-blue)]">Latest action:</span>{" "}
          {rec.latestAction}
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Updated {relativeTime(rec.updatedAt)}
          </p>
        </div>
        <ReactionBar />
      </div>

      <SectionLabel>Timeline</SectionLabel>
      <ol className="relative ml-3 space-y-4 border-l border-border pl-5">
        {rec.updates.map((u, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[27px] top-1.5 size-2.5 rounded-full bg-[var(--smc-teal)] ring-2 ring-card" />
            <p className="text-[13px] font-semibold text-foreground">{u.label}</p>
            {u.detail && <p className="text-[12px] text-foreground/80">{u.detail}</p>}
            <p className="text-[11px] text-muted-foreground">{relativeTime(u.at)}</p>
          </li>
        ))}
      </ol>

      {rec.corrections && rec.corrections.length > 0 && (
        <>
          <SectionLabel>
            Corrections
          </SectionLabel>
          <div className="space-y-2">
            {rec.corrections.map((c, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-md border border-[var(--danger)]/20 bg-[var(--danger-soft)]/40 p-3 text-[12px]"
              >
                <History className="mt-0.5 size-4 shrink-0 text-[var(--danger)]" />
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{c.field} corrected</p>
                  <p className="text-foreground/85">
                    <span className="line-through text-muted-foreground">{c.previous}</span>{" "}
                    → <span className="font-semibold tabular">{c.next}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">{relativeTime(c.at)}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </PortalShell>
  );
}

function Stat({ k, v, tone }: { k: string; v: string; tone?: "danger" | "success" }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</p>
      <p
        className={`tabular font-semibold ${
          tone === "danger"
            ? "text-[var(--danger)]"
            : tone === "success"
              ? "text-[var(--success)]"
              : "text-foreground"
        }`}
      >
        {v}
      </p>
    </div>
  );
}