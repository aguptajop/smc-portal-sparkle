import { Link } from "@tanstack/react-router";
import { AlertTriangle, Activity, Clock } from "lucide-react";
import { actionRequiredCount, commentaries, products, relativeTime } from "@/lib/mock-data";
import type { ReactNode } from "react";

function Stat({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: "success";
}) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span
        className={`mt-1 inline-flex items-center gap-1.5 text-[14px] font-semibold ${
          tone === "success" ? "text-[var(--success)]" : "text-foreground"
        }`}
      >
        {icon}
        {value}
      </span>
    </div>
  );
}

export function ResearchContinuityBanner() {
  const lastCall = [...products]
    .map((p) => p.lastCallAt)
    .filter(Boolean)
    .sort()
    .reverse()[0];
  const lastCommentary = [...commentaries].sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
  )[0];

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat
          icon={<Activity className="size-3.5" />}
          label="Research status"
          value="Active Today"
          tone="success"
        />
        <Stat
          icon={<Clock className="size-3.5" />}
          label="Last call published"
          value={lastCall ? relativeTime(lastCall) : "—"}
        />
        <Stat
          icon={<Clock className="size-3.5" />}
          label="Last commentary"
          value={lastCommentary ? relativeTime(lastCommentary.publishedAt) : "—"}
        />
      </div>
    </div>
  );
}

export function NeedAttentionBanner() {
  const ar = actionRequiredCount();
  const updates = 3;
  const newComm = commentaries.filter(
    (c) => Date.now() - +new Date(c.publishedAt) < 12 * 3600_000,
  ).length;

  if (ar + updates + newComm === 0) return null;

  return (
    <div className="rounded-lg border border-[var(--warning)]/30 bg-[var(--warning-soft)]/60 p-4">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <span className="grid size-9 place-items-center rounded-md bg-[var(--warning)]/15 text-[var(--warning)]">
          <AlertTriangle className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-foreground">Need attention</p>
          <p className="mt-0.5 text-[12px] text-foreground/80">
            {ar} recommendation{ar === 1 ? "" : "s"} require action · {updates} updates since your
            last visit · {newComm} new commentary
          </p>
        </div>
        <Link
          to="/client/activity"
          className="shrink-0 rounded-md bg-[var(--smc-blue)] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[var(--smc-blue-dark)]"
        >
          Review
        </Link>
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  hint,
  icon,
}: {
  title: string;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card/50 p-8 text-center">
      <div className="mx-auto mb-3 grid size-10 place-items-center rounded-md bg-secondary text-muted-foreground">
        {icon}
      </div>
      <p className="text-[14px] font-semibold text-foreground">{title}</p>
      {hint && <p className="mt-1 text-[12px] text-muted-foreground">{hint}</p>}
    </div>
  );
}