import type { ReactNode } from "react";
import { AlertCircle, WifiOff, Lock, CheckCircle2, Inbox, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-secondary/80", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3">
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
      </div>
      <Skeleton className="mt-4 h-3 w-2/3" />
    </div>
  );
}

function Shell({
  tone,
  icon,
  title,
  hint,
  action,
}: {
  tone: "neutral" | "warning" | "danger" | "success";
  icon: ReactNode;
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  const toneClass = {
    neutral: "text-muted-foreground bg-secondary",
    warning: "text-[var(--warning)] bg-[var(--warning-soft)]",
    danger: "text-[var(--danger)] bg-[var(--danger-soft)]",
    success: "text-[var(--success)] bg-[var(--success-soft)]",
  }[tone];
  return (
    <div className="rounded-lg border border-dashed border-border bg-card/60 p-8 text-center">
      <div className={cn("mx-auto mb-3 grid size-11 place-items-center rounded-md", toneClass)}>
        {icon}
      </div>
      <p className="text-[14px] font-semibold text-foreground">{title}</p>
      {hint && <p className="mx-auto mt-1 max-w-sm text-[12px] leading-relaxed text-muted-foreground">{hint}</p>}
      {action && <div className="mt-4 inline-flex">{action}</div>}
    </div>
  );
}

export function EmptyView({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return <Shell tone="neutral" icon={<Inbox className="size-5" />} title={title} hint={hint} action={action} />;
}

export function ErrorView({
  title = "Something went wrong",
  hint = "We couldn't load this view. Please retry.",
  onRetry,
}: {
  title?: string;
  hint?: string;
  onRetry?: () => void;
}) {
  return (
    <Shell
      tone="danger"
      icon={<AlertCircle className="size-5" />}
      title={title}
      hint={hint}
      action={
        onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--smc-blue)] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[var(--smc-blue-dark)]"
          >
            <RefreshCw className="size-3.5" /> Retry
          </button>
        )
      }
    />
  );
}

export function OfflineView() {
  return (
    <Shell
      tone="warning"
      icon={<WifiOff className="size-5" />}
      title="You're offline"
      hint="Showing the last cached snapshot. New research will appear once you're back online."
    />
  );
}

export function PermissionDeniedView({
  title = "Subscription required",
  hint = "This view is only available to subscribed clients.",
  action,
}: {
  title?: string;
  hint?: string;
  action?: ReactNode;
}) {
  return <Shell tone="warning" icon={<Lock className="size-5" />} title={title} hint={hint} action={action} />;
}

export function SuccessView({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return <Shell tone="success" icon={<CheckCircle2 className="size-5" />} title={title} hint={hint} action={action} />;
}