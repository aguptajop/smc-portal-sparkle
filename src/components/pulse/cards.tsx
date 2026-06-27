import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Pin, FileText, BarChart3, TrendingUp, Vote } from "lucide-react";
import type { Commentary, Poll, Product, Recommendation } from "@/lib/mock-data";
import { getProduct, recommendations as _recs, relativeTime } from "@/lib/mock-data";
import type { IPO, OFS, ResearchReport } from "@/lib/pulse-data";
import { DirectionTag, StatusChip } from "./status-chip";
import { ProductBadge } from "./product-badge";
import { cn } from "@/lib/utils";

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

function Field({ k, v, tone }: { k: string; v: string; tone?: "danger" | "success" }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</span>
      <span
        className={cn(
          "tabular font-semibold text-foreground",
          tone === "danger" && "text-[var(--danger)]",
          tone === "success" && "text-[var(--success)]",
        )}
      >
        {v}
      </span>
    </div>
  );
}

export function RecommendationCard({
  rec,
  href,
  compact,
  showProductBadge,
}: {
  rec: Recommendation;
  href?: string;
  compact?: boolean;
  showProductBadge?: boolean;
}) {
  const target = href ?? `/client/recommendation/${rec.id}`;
  const product = showProductBadge ? getProduct(rec.productId) : undefined;
  return (
    <Link
      to={target}
      className={cn(
        "group block rounded-lg border border-border bg-card p-4 transition-colors hover:border-[var(--smc-teal)]/40 hover:shadow-[0_1px_2px_rgba(0,58,112,0.06)]",
        rec.status === "ACTION_REQUIRED" && "border-l-[3px] border-l-[var(--warning)]",
      )}
    >
      {product && (
        <div className="mb-2">
          <ProductBadge product={product} />
        </div>
      )}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <DirectionTag dir={rec.direction} />
            <span className="truncate text-[15px] font-semibold text-foreground tabular">
              {rec.instrument}
            </span>
            <span className="hidden sm:inline text-[11px] text-muted-foreground">
              {assetLabel(rec.assetClass)}
              {rec.expiry ? ` · ${rec.expiry}` : ""}
            </span>
          </div>
          {!compact && (
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] sm:grid-cols-4">
              <Field k="Entry" v={rec.entry} />
              <Field k="SL" v={rec.sl} tone="danger" />
              <Field k="Target" v={rec.targets[0]} tone="success" />
              <Field k="Target 2" v={rec.targets[1] ?? "—"} tone="success" />
            </div>
          )}
          <p className={cn("text-[13px] text-foreground", compact ? "mt-2" : "mt-3")}>
            <span className="font-semibold">{rec.latestAction}</span>
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {relativeTime(rec.updatedAt)}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <StatusChip status={rec.status} pnlPct={rec.pnlPct} />
          <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

function activeFor(pid: string) {
  return _recs.filter(
    (r) =>
      r.productId === pid &&
      (r.status === "ACTIVE" || r.status === "PARTIAL" || r.status === "ACTION_REQUIRED"),
  ).length;
}
function actionFor(pid: string) {
  return _recs.filter((r) => r.productId === pid && r.status === "ACTION_REQUIRED").length;
}

export function ProductCard({ product }: { product: Product }) {
  const Wrapper: any = product.subscribed ? Link : "div";
  const wrapperProps: any = product.subscribed
    ? { to: `/client/product/${product.id}` }
    : {};
  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        "group block rounded-lg border border-border bg-card p-4 transition-colors",
        product.subscribed && "hover:border-[var(--smc-teal)]/40",
      )}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[15px] font-semibold text-foreground">{product.name}</h3>
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider",
                product.researchStatus === "Active Today"
                  ? "text-[var(--success)]"
                  : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  product.researchStatus === "Active Today"
                    ? "bg-[var(--success)]"
                    : "bg-muted-foreground/50",
                )}
              />
              {product.researchStatus}
            </span>
          </div>
          <p className="mt-0.5 text-[12px] text-muted-foreground">{product.tagline}</p>

          {product.subscribed ? (
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-muted-foreground">
              <span>
                <span className="font-semibold text-foreground tabular">{activeFor(product.id)}</span>{" "}
                active
              </span>
              {actionFor(product.id) > 0 && (
                <span className="font-semibold text-[var(--warning)]">
                  {actionFor(product.id)} need action
                </span>
              )}
              {product.lastCallAt && (
                <span>Last call · {relativeTime(product.lastCallAt)}</span>
              )}
            </div>
          ) : (
            <div className="mt-3 inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-[11px] font-medium text-muted-foreground">
              Subscription required
            </div>
          )}
        </div>
        {product.subscribed && (
          <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        )}
      </div>
    </Wrapper>
  );
}

export function CommentaryCard({
  c,
  expanded,
  showProductBadge,
  compact,
}: {
  c: Commentary;
  expanded?: boolean;
  showProductBadge?: boolean;
  compact?: boolean;
}) {
  const product = showProductBadge ? getProduct(c.productId) : undefined;
  return (
    <Link
      to={`/client/commentary/${c.id}`}
      className={cn(
        "block rounded-lg border border-border bg-card p-4 transition-colors hover:border-[var(--smc-teal)]/40",
        c.pinned && !compact && "ring-1 ring-[var(--smc-teal)]/30 bg-accent/40",
      )}
    >
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
        {product && <ProductBadge product={product} />}
        {c.pinned && (
          <span className="inline-flex items-center gap-1 text-[var(--smc-teal)]">
            <Pin className="size-3" /> Pinned
          </span>
        )}
        <span className="text-[var(--smc-blue)]">{c.type}</span>
        <span className="text-muted-foreground">· {relativeTime(c.publishedAt)}</span>
      </div>
      <h4 className={cn("mt-1.5 font-semibold text-foreground", compact ? "text-[14px]" : "text-[15px]")}>
        {c.title}
      </h4>
      {!compact && (
        <p className="mt-1 text-[13px] leading-relaxed text-foreground/85">
          {expanded ? c.body : c.preview}
        </p>
      )}
    </Link>
  );
}

/** Compact pinned commentary on Home: max 2 lines + Read more. */
export function PinnedCommentary({ c }: { c: Commentary }) {
  return (
    <Link
      to={`/client/commentary/${c.id}`}
      className="block rounded-lg border border-[var(--smc-teal)]/30 bg-[#E0F7FA]/40 p-3 transition-colors hover:bg-[#E0F7FA]/70"
    >
      <div className="flex items-start gap-2">
        <Pin className="mt-0.5 size-3.5 shrink-0 text-[var(--smc-teal)]" />
        <p className="text-[13px] leading-relaxed text-foreground/90">
          <span className="line-clamp-2">{c.title} — {c.preview}</span>
          <span className="ml-1 font-semibold text-[var(--smc-blue)]">Read more →</span>
        </p>
      </div>
    </Link>
  );
}

export function PollCard({ poll, showProductBadge }: { poll: Poll; showProductBadge?: boolean }) {
  const product = showProductBadge ? getProduct(poll.productId) : undefined;
  const remaining = Math.max(0, Math.round((+new Date(poll.closesAt) - Date.now()) / 3600_000));
  return (
    <Link
      to={`/client/poll/${poll.id}`}
      className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-[var(--smc-teal)]/40"
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
        {product && <ProductBadge product={product} />}
        <span className="inline-flex items-center gap-1 text-[var(--smc-blue)]">
          <Vote className="size-3" /> Poll
        </span>
      </div>
      <p className="mt-1.5 text-[14px] font-semibold text-foreground">{poll.question}</p>
      <p className="mt-1 text-[11px] text-muted-foreground tabular">
        {poll.totalVotes} votes · Closes in {remaining}h
      </p>
    </Link>
  );
}

export function ReportCard({ report, showProductBadge }: { report: ResearchReport; showProductBadge?: boolean }) {
  const product = showProductBadge && report.productId ? getProduct(report.productId) : undefined;
  return (
    <Link
      to={`/client/report/${report.id}`}
      className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-[var(--smc-teal)]/40"
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
        {product && <ProductBadge product={product} />}
        <span className="inline-flex items-center gap-1 text-[var(--smc-blue)]">
          <FileText className="size-3" /> {report.type}
        </span>
        <span className="text-muted-foreground">· {relativeTime(report.publishedAt)}</span>
      </div>
      <p className="mt-1.5 text-[14px] font-semibold text-foreground">{report.title}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{report.analyst} · {report.pages} pages</p>
    </Link>
  );
}

export function IpoCardCompact({ ipo }: { ipo: IPO }) {
  return (
    <Link
      to={`/client/ipo/${ipo.id}`}
      className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-[var(--smc-teal)]/40"
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
        <TrendingUp className="size-3 text-[var(--smc-blue)]" />
        <span className="text-[var(--smc-blue)]">{ipo.category}</span>
        <span className="text-muted-foreground">· {ipo.status}</span>
      </div>
      <p className="mt-1.5 text-[14px] font-semibold text-foreground">{ipo.name}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground tabular">
        {ipo.priceBand} · Lot {ipo.lotSize} · SMC: {ipo.smcView}
      </p>
    </Link>
  );
}

export function OfsCardCompact({ ofs }: { ofs: OFS }) {
  return (
    <Link
      to={`/client/ofs/${ofs.id}`}
      className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-[var(--smc-teal)]/40"
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
        <BarChart3 className="size-3 text-[var(--smc-blue)]" />
        <span className="text-[var(--smc-blue)]">{ofs.segment} OFS</span>
        <span className="text-muted-foreground">· {ofs.status}</span>
      </div>
      <p className="mt-1.5 text-[14px] font-semibold text-foreground">{ofs.name}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground tabular">
        Floor ₹{ofs.floorPrice} · CMP ₹{ofs.cmp} · SMC: {ofs.smcView}
      </p>
    </Link>
  );
}