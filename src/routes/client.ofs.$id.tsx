import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PortalShell } from "@/components/pulse/portal-shell";
import { ReactionBar } from "@/components/pulse/reactions";
import { ofsList } from "@/lib/pulse-data";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/client/ofs/$id")({
  loader: ({ params }) => {
    const o = ofsList.find((x) => x.id === params.id);
    if (!o) throw notFound();
    return { o };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.o.name ?? "OFS"} — SMC Pulse` }],
  }),
  component: OfsDetail,
});

function OfsDetail() {
  const { o } = Route.useLoaderData();
  const premium = (((o.cmp - o.floorPrice) / o.floorPrice) * 100).toFixed(1);
  return (
    <PortalShell portal="client" title="OFS Review">
      <Link
        to="/client/activity"
        className="mb-3 inline-flex min-h-9 items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back
      </Link>

      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--smc-blue)]">
        <BarChart3 className="mr-1 inline size-3" /> {o.segment} OFS · {o.symbol}
      </p>
      <h1 className="mt-1 text-[22px] font-bold leading-tight text-foreground sm:text-[26px]">{o.name}</h1>

      <div
        className={cn(
          "mt-4 flex items-center justify-center rounded-lg px-4 py-3 text-[14px] font-bold uppercase tracking-wider",
          o.smcView === "Subscribe"
            ? "bg-[var(--success-soft)] text-[var(--success)]"
            : o.smcView === "Avoid"
              ? "bg-[var(--danger-soft)] text-[var(--danger)]"
              : "bg-secondary text-muted-foreground",
        )}
      >
        SMC view: {o.smcView}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-border bg-card p-4 text-[13px] sm:grid-cols-4">
        <Meta k="Floor price" v={`₹${o.floorPrice}`} />
        <Meta k="CMP" v={`₹${o.cmp}`} />
        <Meta k="Premium" v={`${premium}%`} />
        <Meta k="Status" v={o.status} />
      </div>

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