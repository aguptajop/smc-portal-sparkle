import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import { ipos, ofsList, relativeTime } from "@/lib/pulse-data";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

export const Route = createFileRoute("/client/ipo")({
  head: () => ({ meta: [{ title: "IPO & OFS — SMC Pulse" }] }),
  component: IpoOfsPage,
});

function IpoOfsPage() {
  const [tab, setTab] = useState<"ipo" | "ofs">("ipo");

  return (
    <PortalShell portal="client">
      <PageHeader title="IPO & OFS" subtitle="Primary market issuances with the SMC research view" />

      <div className="mb-3 inline-flex rounded-md border border-border bg-card p-0.5 text-[12px] font-medium">
        {(["ipo", "ofs"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={cn(
              "rounded-[6px] px-3 py-1.5",
              tab === k ? "bg-[var(--smc-blue)] text-white" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {k.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === "ipo" ? (
        <div className="space-y-5">
          {(["OPEN", "UPCOMING", "LISTED"] as const).map((s) => {
            const list = ipos.filter((i) => i.status === s);
            if (list.length === 0) return null;
            return (
              <section key={s}>
                <SectionLabel hint={`${list.length} issue${list.length === 1 ? "" : "s"}`}>
                  {s === "OPEN" ? "Open now" : s === "UPCOMING" ? "Upcoming" : "Recently listed"}
                </SectionLabel>
                <div className="grid gap-3 sm:grid-cols-2">
                  {list.map((i) => (
                    <article key={i.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{i.category} · {i.symbol}</p>
                          <h3 className="truncate text-[15px] font-semibold text-foreground">{i.name}</h3>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                            i.smcView === "Subscribe"
                              ? "bg-[var(--success-soft)] text-[var(--success)]"
                              : i.smcView === "Avoid"
                                ? "bg-[var(--danger-soft)] text-[var(--danger)]"
                                : "bg-secondary text-muted-foreground",
                          )}
                        >
                          SMC: {i.smcView}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-3 text-[12px]">
                        <Field k="Price band" v={i.priceBand} />
                        <Field k="Lot size" v={String(i.lotSize)} />
                        <Field k="GMP" v={i.gmp != null ? `₹${i.gmp}` : "—"} />
                      </div>
                      <p className="mt-3 text-[12px] text-foreground/85">{i.rationale}</p>
                      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Closes {relativeTime(i.close)}</span>
                        {i.status !== "LISTED" && (
                          <button className="inline-flex items-center gap-1 rounded-md bg-[var(--smc-blue)] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[var(--smc-blue-dark)]">
                            <TrendingUp className="size-3" /> Apply via UPI
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {ofsList.map((o) => (
            <article key={o.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{o.segment} · {o.symbol}</p>
                  <h3 className="text-[15px] font-semibold text-foreground">{o.name}</h3>
                </div>
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase",
                    o.status === "OPEN" ? "bg-[var(--success-soft)] text-[var(--success)]" : "bg-secondary text-muted-foreground",
                  )}
                >
                  {o.status}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-[12px]">
                <Field k="Floor price" v={`₹${o.floorPrice}`} />
                <Field k="CMP" v={`₹${o.cmp}`} />
                <Field k="Premium" v={`${(((o.cmp - o.floorPrice) / o.floorPrice) * 100).toFixed(1)}%`} />
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">SMC view: <span className="font-semibold text-foreground">{o.smcView}</span></p>
            </article>
          ))}
        </div>
      )}
    </PortalShell>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</span>
      <span className="font-semibold text-foreground tabular">{v}</span>
    </div>
  );
}