import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, PortalShell } from "@/components/pulse/portal-shell";
import {
  CommentaryCard,
  IpoCardCompact,
  OfsCardCompact,
  PollCard,
  RecommendationCard,
  ReportCard,
} from "@/components/pulse/cards";
import { EmptyView } from "@/components/pulse/states";
import {
  commentaries,
  polls,
  products,
  recommendations,
} from "@/lib/mock-data";
import { ipos, ofsList, reports } from "@/lib/pulse-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/client/activity")({
  head: () => ({
    meta: [
      { title: "Activity — SMC Pulse" },
      {
        name: "description",
        content:
          "Cross-product chronological feed of every research update, commentary, poll, report and IPO across your subscriptions.",
      },
      { property: "og:title", content: "SMC Pulse — Activity Center" },
      { property: "og:description", content: "Every research update, in order." },
    ],
  }),
  component: ActivityCenter,
});

type TypeFilter = "All" | "Calls" | "Commentary" | "Polls" | "Reports" | "IPO/OFS";
type StatusFilter = "All" | "Active" | "Partial" | "Closed" | "Action Required";
type TimeFilter = "All" | "Today" | "This Week" | "This Month";

interface FeedItem {
  at: string;
  kind: "rec" | "commentary" | "poll" | "report" | "ipo" | "ofs";
  productId?: string;
  render: () => React.ReactNode;
  matchType: TypeFilter;
  matchStatus?: StatusFilter;
}

function ActivityCenter() {
  const subscribed = products.filter((p) => p.subscribed);
  const [productScope, setProductScope] = useState<string>("all");
  const [type, setType] = useState<TypeFilter>("All");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [time, setTime] = useState<TimeFilter>("All");
  const [page, setPage] = useState(20);

  const feed = useMemo<FeedItem[]>(() => {
    const list: FeedItem[] = [];
    for (const r of recommendations) {
      list.push({
        at: r.updatedAt,
        kind: "rec",
        productId: r.productId,
        matchType: "Calls",
        matchStatus:
          r.status === "ACTION_REQUIRED"
            ? "Action Required"
            : r.status === "ACTIVE"
              ? "Active"
              : r.status === "PARTIAL"
                ? "Partial"
                : "Closed",
        render: () => <RecommendationCard rec={r} showProductBadge compact />,
      });
    }
    for (const c of commentaries) {
      list.push({
        at: c.publishedAt,
        kind: "commentary",
        productId: c.productId,
        matchType: "Commentary",
        render: () => <CommentaryCard c={c} showProductBadge compact />,
      });
    }
    for (const p of polls) {
      list.push({
        at: p.closesAt,
        kind: "poll",
        productId: p.productId,
        matchType: "Polls",
        render: () => <PollCard poll={p} showProductBadge />,
      });
    }
    for (const r of reports) {
      list.push({
        at: r.publishedAt,
        kind: "report",
        productId: r.productId,
        matchType: "Reports",
        render: () => <ReportCard report={r} showProductBadge />,
      });
    }
    for (const i of ipos) {
      list.push({
        at: i.open,
        kind: "ipo",
        matchType: "IPO/OFS",
        render: () => <IpoCardCompact ipo={i} />,
      });
    }
    for (const o of ofsList) {
      list.push({
        at: o.date,
        kind: "ofs",
        matchType: "IPO/OFS",
        render: () => <OfsCardCompact ofs={o} />,
      });
    }
    return list.sort((a, b) => +new Date(b.at) - +new Date(a.at));
  }, []);

  const filtered = feed.filter((it) => {
    if (productScope !== "all" && it.productId && it.productId !== productScope) return false;
    if (productScope !== "all" && !it.productId) return false; // IPO/OFS only when "All"
    if (type !== "All" && it.matchType !== type) return false;
    if (status !== "All" && it.matchStatus !== status) return false;
    if (time !== "All") {
      const diffH = (Date.now() - +new Date(it.at)) / 3600_000;
      if (time === "Today" && diffH > 24) return false;
      if (time === "This Week" && diffH > 7 * 24) return false;
      if (time === "This Month" && diffH > 30 * 24) return false;
    }
    return true;
  });

  const visible = filtered.slice(0, page);
  const hasMore = page < filtered.length;
  const anyFilter =
    productScope !== "all" || type !== "All" || status !== "All" || time !== "All";

  return (
    <PortalShell portal="client" title="Activity">
      <PageHeader title="Activity" subtitle="Everything that changed across your subscriptions." />

      {/* Filter chip bar */}
      <div className="-mx-1 mb-4 flex gap-1 overflow-x-auto px-1 pb-1">
        <Chip active={productScope === "all"} onClick={() => setProductScope("all")}>All products</Chip>
        {subscribed.map((p) => (
          <Chip key={p.id} active={productScope === p.id} onClick={() => setProductScope(p.id)}>
            {p.name}
          </Chip>
        ))}
        <span className="mx-1 my-auto h-5 w-px shrink-0 bg-border" />
        {(["All", "Calls", "Commentary", "Polls", "Reports", "IPO/OFS"] as TypeFilter[]).map((t) => (
          <Chip key={t} active={type === t} onClick={() => setType(t)}>
            {t}
          </Chip>
        ))}
        <span className="mx-1 my-auto h-5 w-px shrink-0 bg-border" />
        {(["All", "Action Required", "Active", "Partial", "Closed"] as StatusFilter[]).map((s) => (
          <Chip key={s} active={status === s} onClick={() => setStatus(s)}>
            {s}
          </Chip>
        ))}
        <span className="mx-1 my-auto h-5 w-px shrink-0 bg-border" />
        {(["All", "Today", "This Week", "This Month"] as TimeFilter[]).map((t) => (
          <Chip key={t} active={time === t} onClick={() => setTime(t)}>
            {t}
          </Chip>
        ))}
        {anyFilter && (
          <button
            onClick={() => {
              setProductScope("all");
              setType("All");
              setStatus("All");
              setTime("All");
            }}
            className="ml-2 shrink-0 rounded-md px-2.5 py-1.5 text-[12px] font-medium text-[var(--smc-blue)] hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <EmptyView
          title={anyFilter ? "No results for current filters" : "No activity yet"}
          hint={anyFilter ? "Try clearing a filter." : "Research updates will appear here once published."}
          action={
            anyFilter && (
              <button
                onClick={() => {
                  setProductScope("all");
                  setType("All");
                  setStatus("All");
                  setTime("All");
                }}
                className="rounded-md bg-[var(--smc-blue)] px-3 py-1.5 text-[12px] font-semibold text-white"
              >
                Clear filters
              </button>
            )
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {visible.map((it, i) => (
              <div key={i}>{it.render()}</div>
            ))}
          </div>
          {hasMore ? (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setPage((p) => p + 10)}
                className="rounded-md border border-border bg-card px-4 py-2 text-[12px] font-semibold text-foreground hover:bg-secondary"
              >
                Load more
              </button>
            </div>
          ) : (
            <p className="mt-6 text-center text-[12px] text-muted-foreground">You're all caught up.</p>
          )}
        </>
      )}
    </PortalShell>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
        active
          ? "border-[var(--smc-teal)] bg-[#E0F7FA] text-[var(--smc-blue)]"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}