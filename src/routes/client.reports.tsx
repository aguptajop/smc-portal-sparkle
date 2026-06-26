import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PortalShell } from "@/components/pulse/portal-shell";
import { reports, relativeTime } from "@/lib/pulse-data";
import { FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyView } from "@/components/pulse/states";

export const Route = createFileRoute("/client/reports")({
  head: () => ({ meta: [{ title: "Reports — SMC Pulse" }] }),
  component: ReportsPage,
});

const TYPES = ["All", "Sector", "Thematic", "Model Portfolio", "Earnings Review", "Macro"] as const;

function ReportsPage() {
  const [filter, setFilter] = useState<(typeof TYPES)[number]>("All");
  const visible = filter === "All" ? reports : reports.filter((r) => r.type === filter);

  return (
    <PortalShell portal="client">
      <PageHeader title="Research reports" subtitle="Deep-dives across sectors, themes and macro" />

      <div className="mb-3 -mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              "shrink-0 rounded-md px-3 py-1.5 text-[12px] font-medium",
              filter === t ? "bg-[var(--smc-blue)] text-white" : "bg-secondary text-muted-foreground hover:bg-accent",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyView title="No reports in this category" hint="Try another filter." />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {visible.map((r) => (
            <li key={r.id} className="rounded-lg border border-border bg-card p-4 hover:border-[var(--smc-teal)]/40">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--smc-blue)]">
                <FileText className="size-3.5" /> {r.type}
                <span className="ml-auto font-normal text-muted-foreground">{relativeTime(r.publishedAt)}</span>
              </div>
              <h3 className="mt-1 text-[14px] font-semibold text-foreground">{r.title}</h3>
              <p className="mt-1 text-[12px] text-muted-foreground">{r.preview}</p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{r.analyst} · {r.pages} pages</span>
                <button className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 hover:bg-secondary">
                  <Download className="size-3" /> PDF
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}