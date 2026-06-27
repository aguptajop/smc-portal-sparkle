import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import { ReactionBar } from "@/components/pulse/reactions";
import { type IPO, ipos } from "@/lib/pulse-data";
import { ArrowLeft, Download, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/client/ipo/$id")({
  loader: ({ params }) => {
    const i = ipos.find((x) => x.id === params.id);
    if (!i) throw notFound();
    return { i };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.i.name ?? "IPO"} — SMC Pulse` },
      { name: "description", content: loaderData?.i.rationale ?? "SMC IPO review." },
    ],
  }),
  component: IpoDetail,
});

function IpoDetail() {
  const { i } = Route.useLoaderData() as { i: IPO };
  return (
    <PortalShell portal="client" title="IPO Review">
      <Link
        to="/client/activity"
        className="mb-3 inline-flex min-h-9 items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back
      </Link>

      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--smc-blue)]">
        {i.category} IPO · {i.symbol}
      </p>
      <h1 className="mt-1 text-[22px] font-bold leading-tight text-foreground sm:text-[26px]">{i.name}</h1>

      <div className="mt-4 grid grid-cols-1 gap-2">
        <div
          className={cn(
            "flex items-center justify-center rounded-lg px-4 py-3 text-[14px] font-bold uppercase tracking-wider",
            i.smcView === "Subscribe"
              ? "bg-[var(--success-soft)] text-[var(--success)]"
              : i.smcView === "Avoid"
                ? "bg-[var(--danger-soft)] text-[var(--danger)]"
                : "bg-secondary text-muted-foreground",
          )}
        >
          SMC view: {i.smcView}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-border bg-card p-4 text-[13px] sm:grid-cols-4">
        <Meta k="Price band" v={i.priceBand} />
        <Meta k="Lot size" v={String(i.lotSize)} />
        <Meta k="GMP" v={i.gmp != null ? `₹${i.gmp}` : "—"} />
        <Meta k="Status" v={i.status} />
      </div>

      <SectionLabel>Rationale</SectionLabel>
      <div className="rounded-lg border border-border bg-card p-4 text-[13px] leading-relaxed text-foreground/90">
        {i.rationale}
      </div>

      {i.status !== "LISTED" && (
        <button className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md bg-[var(--smc-blue)] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[var(--smc-blue-dark)]">
          <TrendingUp className="size-4" /> Apply via UPI
        </button>
      )}
      <button className="ml-2 mt-4 inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-[13px] font-semibold text-foreground hover:bg-secondary">
        <Download className="size-4" /> Full report
      </button>

      <ReactionBar />
    </PortalShell>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</p>
      <p className="font-semibold text-foreground tabular">{v}</p>
    </div>
  );
}