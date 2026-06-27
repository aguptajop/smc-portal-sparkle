import type { RecStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const LABELS: Record<RecStatus, string> = {
  ACTION_REQUIRED: "Action Required",
  ACTIVE: "Active",
  PARTIAL: "Partial",
  CLOSED: "Closed",
  CLOSED_WIN: "Closed",
  CLOSED_LOSS: "Closed",
  CORRECTED: "Corrected",
};

const STYLES: Record<RecStatus, string> = {
  ACTION_REQUIRED:
    "bg-[var(--warning-soft)] text-[var(--warning)] ring-1 ring-inset ring-[var(--warning)]/20",
  ACTIVE: "bg-[var(--success-soft)] text-[var(--success)] ring-1 ring-inset ring-[var(--success)]/20",
  PARTIAL: "bg-[var(--info-soft)] text-[var(--smc-blue)] ring-1 ring-inset ring-[var(--smc-blue)]/15",
  CLOSED: "bg-secondary text-muted-foreground ring-1 ring-inset ring-border",
  CLOSED_WIN: "bg-[var(--success-soft)] text-[var(--success)] ring-1 ring-inset ring-[var(--success)]/20",
  CLOSED_LOSS: "bg-[var(--danger-soft)] text-[var(--danger)] ring-1 ring-inset ring-[var(--danger)]/20",
  CORRECTED: "bg-[var(--danger-soft)] text-[var(--danger)] ring-1 ring-inset ring-[var(--danger)]/20",
};

export function StatusChip({
  status,
  className,
  pnlPct,
}: {
  status: RecStatus;
  className?: string;
  /** When present and status is closed-flavoured, shown after label, e.g. "Closed +2.8%" */
  pnlPct?: number;
}) {
  const label = LABELS[status];
  const showPnl =
    typeof pnlPct === "number" && (status === "CLOSED_WIN" || status === "CLOSED_LOSS" || status === "CLOSED");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        STYLES[status],
        className,
      )}
    >
      {status === "ACTION_REQUIRED" && (
        <span className="size-1.5 rounded-full bg-current animate-pulse" />
      )}
      {label}
      {showPnl && (
        <span className="tabular">
          {" "}
          {pnlPct! > 0 ? "+" : ""}
          {pnlPct!.toFixed(1)}%
        </span>
      )}
    </span>
  );
}

export function DirectionTag({ dir }: { dir: "BUY" | "SELL" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-bold tracking-wider",
        dir === "BUY"
          ? "bg-[var(--success-soft)] text-[var(--success)]"
          : "bg-[var(--danger-soft)] text-[var(--danger)]",
      )}
    >
      {dir}
    </span>
  );
}