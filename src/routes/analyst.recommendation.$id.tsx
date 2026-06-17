import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader, PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import { DirectionTag, StatusChip } from "@/components/pulse/status-chip";
import type { Recommendation } from "@/lib/mock-data";
import { recommendations, relativeTime } from "@/lib/mock-data";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/analyst/recommendation/$id")({
  loader: ({ params }) => {
    const rec = recommendations.find((r) => r.id === params.id);
    if (!rec) throw notFound();
    return { rec };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Update ${loaderData?.rec.instrument ?? ""} — SMC Pulse Analyst` },
      {
        name: "description",
        content: `Manage the ${loaderData?.rec.instrument ?? ""} recommendation: book, trail SL, exit, or correct.`,
      },
    ],
  }),
  component: UpdateRec,
});

function UpdateRec() {
  const { rec } = Route.useLoaderData() as { rec: Recommendation };

  return (
    <PortalShell portal="analyst" title={`Update ${rec.instrument}`}>
      <Link
        to="/analyst"
        className="mb-3 inline-flex items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to queue
      </Link>

      <PageHeader
        title={`${rec.direction} ${rec.instrument}`}
        subtitle={`${rec.productId} · Updated ${relativeTime(rec.updatedAt)}`}
        right={<StatusChip status={rec.status} />}
      />

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2 text-[13px]">
          <DirectionTag dir={rec.direction} />
          <span className="font-semibold tabular">{rec.entry}</span>
          <span className="text-muted-foreground">entry · SL</span>
          <span className="font-semibold tabular text-[var(--danger)]">{rec.sl}</span>
          <span className="text-muted-foreground">· targets</span>
          <span className="font-semibold tabular text-[var(--success)]">
            {rec.targets.join(" / ")}
          </span>
        </div>
      </div>

      <SectionLabel>Quick actions</SectionLabel>
      <div className="grid gap-2 sm:grid-cols-2">
        <ActionRow title="Book 50%" hint="Partial profit at first target" tone="success" />
        <ActionRow title="Book 100% / Exit" hint="Close the position" tone="success" />
        <ActionRow title="Trail stop loss" hint="Move SL to lock in gains" tone="info" />
        <ActionRow title="Cancel" hint="Idea invalidated before entry" tone="muted" />
      </div>

      <SectionLabel>Correct a published value</SectionLabel>
      <div className="rounded-lg border border-[var(--danger)]/30 bg-[var(--danger-soft)]/30 p-4 text-[12px]">
        <p className="flex items-start gap-2 font-semibold text-foreground">
          <AlertTriangle className="mt-0.5 size-4 text-[var(--danger)]" />
          Corrections are visible to clients
        </p>
        <p className="mt-1 text-foreground/80">
          Previous and new values, plus the time of correction, are shown transparently on the
          client view. This is intentional — never silently change a published call.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <select className="rounded-md border border-border bg-card px-3 py-2 text-[13px]">
            <option>Choose field…</option>
            <option>Entry</option>
            <option>Stop loss</option>
            <option>Target 1</option>
            <option>Target 2</option>
          </select>
          <input
            placeholder="New value"
            className="rounded-md border border-border bg-card px-3 py-2 text-[13px] tabular"
          />
        </div>
        <button className="mt-3 rounded-md bg-[var(--danger)] px-3 py-2 text-[12px] font-semibold text-white">
          Publish correction
        </button>
      </div>

      <SectionLabel>Timeline</SectionLabel>
      <ol className="ml-3 space-y-3 border-l border-border pl-5">
        {rec.updates.map((u, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[27px] top-1.5 size-2.5 rounded-full bg-[var(--smc-teal)] ring-2 ring-card" />
            <p className="text-[13px] font-semibold text-foreground">{u.label}</p>
            <p className="text-[11px] text-muted-foreground">{relativeTime(u.at)}</p>
          </li>
        ))}
      </ol>
    </PortalShell>
  );
}

function ActionRow({
  title,
  hint,
  tone,
}: {
  title: string;
  hint: string;
  tone: "success" | "info" | "muted";
}) {
  const toneClass =
    tone === "success"
      ? "border-[var(--success)]/30 text-[var(--success)]"
      : tone === "info"
        ? "border-[var(--smc-teal)]/30 text-[var(--smc-blue)]"
        : "border-border text-muted-foreground";
  return (
    <button
      className={`flex w-full items-center justify-between rounded-lg border bg-card px-4 py-3 text-left transition-colors hover:bg-secondary ${toneClass}`}
    >
      <div>
        <p className="text-[13px] font-semibold text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      </div>
    </button>
  );
}