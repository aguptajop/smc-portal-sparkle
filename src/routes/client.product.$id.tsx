import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageHeader, PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import { CommentaryCard, RecommendationCard } from "@/components/pulse/cards";
import {
  commentariesByProduct,
  getProduct,
  pinnedCommentary,
  recsByProduct,
  relativeTime,
} from "@/lib/mock-data";
import { EmptyState } from "@/components/pulse/banners";
import { Inbox } from "lucide-react";

export const Route = createFileRoute("/client/product/$id")({
  loader: ({ params }) => {
    const p = getProduct(params.id);
    if (!p) throw notFound();
    return { product: p };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.product.name ?? "Product"} — SMC Pulse` },
      {
        name: "description",
        content:
          loaderData?.product.summary ??
          "Active recommendations, commentary and history for this research product.",
      },
      { property: "og:title", content: `${loaderData?.product.name ?? "Product"} — SMC Pulse` },
      { property: "og:description", content: loaderData?.product.summary ?? "" },
    ],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const recs = recsByProduct(product.id);
  const action = recs.filter((r) => r.status === "ACTION_REQUIRED");
  const active = recs.filter((r) => r.status === "ACTIVE" || r.status === "PARTIAL");
  const closed = recs.filter((r) => r.status === "CLOSED");
  const pinned = pinnedCommentary(product.id);
  const otherCommentary = commentariesByProduct(product.id).filter((c) => !c.pinned);

  return (
    <PortalShell portal="client" title={product.name}>
      <PageHeader
        title={product.name}
        subtitle={product.tagline}
        right={
          <span className="inline-flex items-center gap-1 rounded-md bg-[var(--success-soft)] px-2 py-1 text-[11px] font-semibold text-[var(--success)]">
            <span className="size-1.5 rounded-full bg-[var(--success)]" />
            {product.researchStatus}
          </span>
        }
      />

      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-[13px] leading-relaxed text-foreground/90">{product.summary}</p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-[12px] sm:grid-cols-3">
          <Meta k="Risk profile" v={product.riskProfile} />
          <Meta k="Holding horizon" v={product.holdingHorizon} />
          <Meta
            k="Last call"
            v={product.lastCallAt ? relativeTime(product.lastCallAt) : "—"}
          />
        </div>
      </div>

      {pinned && (
        <>
          <SectionLabel>Pinned commentary</SectionLabel>
          <CommentaryCard c={pinned} expanded />
        </>
      )}

      <SectionLabel hint={`${action.length} item${action.length === 1 ? "" : "s"}`}>
        Action required
      </SectionLabel>
      {action.length === 0 ? (
        <EmptyState
          title="Nothing needs your attention"
          hint="The desk will surface action items here as they come up."
          icon={<Inbox className="size-5" />}
        />
      ) : (
        <div className="space-y-3">
          {action.map((r) => (
            <RecommendationCard key={r.id} rec={r} />
          ))}
        </div>
      )}

      <SectionLabel hint={`${active.length} open`}>Active recommendations</SectionLabel>
      {active.length === 0 ? (
        <EmptyState title="No active recommendations" icon={<Inbox className="size-5" />} />
      ) : (
        <div className="space-y-3">
          {active.map((r) => (
            <RecommendationCard key={r.id} rec={r} />
          ))}
        </div>
      )}

      {otherCommentary.length > 0 && (
        <>
          <SectionLabel>Commentary</SectionLabel>
          <div className="space-y-3">
            {otherCommentary.map((c) => (
              <CommentaryCard key={c.id} c={c} />
            ))}
          </div>
        </>
      )}

      <SectionLabel hint="Last 90 days">Closed recommendations</SectionLabel>
      {closed.length === 0 ? (
        <EmptyState title="No closed calls in the last 90 days" icon={<Inbox className="size-5" />} />
      ) : (
        <div className="space-y-3">
          {closed.map((r) => (
            <RecommendationCard key={r.id} rec={r} compact />
          ))}
        </div>
      )}
    </PortalShell>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</p>
      <p className="font-medium text-foreground">{v}</p>
    </div>
  );
}