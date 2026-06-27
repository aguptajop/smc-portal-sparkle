import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import { DirectionTag, StatusChip } from "@/components/pulse/status-chip";
import type { Recommendation } from "@/lib/mock-data";
import { getProduct, recommendations, relativeTime } from "@/lib/mock-data";
import { ArrowLeft, AlertTriangle, ChevronDown } from "lucide-react";
import { ReactionBar } from "@/components/pulse/reactions";
import { cn } from "@/lib/utils";

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
  const product = getProduct(rec.productId);
  const [showRationale, setShowRationale] = useState(false);

  // Build chronological timeline + corrections as merged events
  const events = [
    ...rec.updates.map((u) => ({ kind: "update" as const, at: u.at, label: u.label, detail: u.detail, type: u.type })),
    ...(rec.corrections ?? []).map((c) => ({
      kind: "correction" as const,
      at: c.at,
      label: `${c.field} corrected`,
      previous: c.previous,
      next: c.next,
    })),
  ].sort((a, b) => +new Date(a.at) - +new Date(b.at));

  return (
    <PortalShell portal="client" title={rec.instrument}>
      <Link
        to="/client/product/$id"
        params={{ id: rec.productId }}
        className="mb-3 inline-flex min-h-9 items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to {product?.name ?? "product"}
      </Link>

      {/* Header: direction + instrument + status */}
      <div className="flex flex-wrap items-center gap-2">
        <DirectionTag dir={rec.direction} />
        <h1 className="text-[22px] font-bold tabular text-foreground">{rec.instrument}</h1>
        <StatusChip status={rec.status} pnlPct={rec.pnlPct} />
      </div>
      <p className="mt-1 text-[12px] text-muted-foreground">
        {assetLabel(rec.assetClass)}
        {rec.strike ? ` · ${rec.strike} ${rec.optionType ?? ""}` : ""}
        {rec.expiry ? ` · Exp ${rec.expiry}` : ""}
      </p>

      {/* Key values */}
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-border bg-card p-4 text-[13px] sm:grid-cols-4">
        <Stat k="Entry" v={rec.entry} />
        <Stat k="Stop loss" v={rec.sl} tone="danger" />
        <Stat k="Target 1" v={rec.targets[0]} tone="success" />
        <Stat k="Target 2" v={rec.targets[1] ?? "—"} tone={rec.targets[1] ? "success" : undefined} />
        {rec.targets[2] && <Stat k="Target 3" v={rec.targets[2]} tone="success" />}
      </div>

      {/* Action banner */}
      {rec.status === "ACTION_REQUIRED" && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border-l-[3px] border-l-[var(--warning)] bg-[var(--warning-soft)]/60 px-4 py-3">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" />
          <p className="text-[13px] font-semibold text-foreground">{rec.latestAction}</p>
        </div>
      )}

      {/* Rationale */}
      {rec.rationale && (
        <>
          <SectionLabel>Rationale</SectionLabel>
          <div className="rounded-lg border border-border bg-card p-4">
            <p
              className={cn(
                "text-[13px] leading-relaxed text-foreground/90",
                !showRationale && "line-clamp-2",
              )}
            >
              {rec.rationale}
            </p>
            {rec.rationale.length > 90 && (
              <button
                onClick={() => setShowRationale((v) => !v)}
                className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--smc-blue)] hover:underline"
              >
                {showRationale ? "Show less" : "Show more"}
                <ChevronDown className={cn("size-3.5 transition-transform", showRationale && "rotate-180")} />
              </button>
            )}
          </div>
        </>
      )}

      {/* Timeline */}
      <SectionLabel hint={`${events.length} event${events.length === 1 ? "" : "s"}`}>Timeline</SectionLabel>
      <ol className="relative ml-3 space-y-4 border-l border-border pl-5">
        {events.map((e, i) => {
          const last = i === events.length - 1;
          if (e.kind === "correction") {
            return (
              <li key={i} className="relative">
                <span className="absolute -left-[27px] top-1.5 size-3 rounded-full bg-[var(--danger)] ring-2 ring-card" />
                <div className="rounded-md border-l-[3px] border-l-[var(--danger)] bg-[var(--danger-soft)]/40 p-3 text-[12px]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--danger)]">Correction</p>
                  <p className="mt-0.5 font-semibold text-foreground">{e.label}</p>
                  <p className="text-foreground/85">
                    <span className="line-through text-muted-foreground tabular">{e.previous}</span>{" "}
                    → <span className="font-semibold tabular">{e.next}</span>
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{relativeTime(e.at)}</p>
                </div>
              </li>
            );
          }
          return (
            <li key={i} className="relative">
              <span
                className={cn(
                  "absolute -left-[27px] top-1.5 rounded-full bg-[var(--smc-teal)] ring-2 ring-card",
                  last ? "size-3" : "size-2.5",
                )}
              />
              <p className="text-[13px] font-semibold text-foreground">{e.label}</p>
              {e.detail && <p className="text-[12px] text-foreground/80">{e.detail}</p>}
              <p className="text-[11px] text-muted-foreground">{relativeTime(e.at)}</p>
            </li>
          );
        })}
      </ol>

      {/* Engagement */}
      <ReactionBar />

      {/* Footer */}
      <div className="mt-6 rounded-lg border border-border bg-card p-4 text-[12px] text-muted-foreground">
        <p>
          Published by <span className="font-semibold text-foreground">SMC Research Desk</span>
        </p>
        <p className="mt-1 tabular">
          {product?.name ?? "—"} · {rec.conviction ?? "Standard"} conviction
        </p>
      </div>
    </PortalShell>
  );
}

function assetLabel(a: Recommendation["assetClass"]) {
  switch (a) {
    case "EQUITY":
      return "Equity Cash";
    case "INDEX_OPTION":
      return "Index Option";
    case "STOCK_OPTION":
      return "Stock Option";
    case "COMMODITY":
      return "Commodity";
  }
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