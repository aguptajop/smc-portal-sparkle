import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, PortalShell } from "@/components/pulse/portal-shell";
import { EmptyView } from "@/components/pulse/states";
import { notifications as initial, relativeTime } from "@/lib/pulse-data";
import { ChevronRight, Bell, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/client/notifications")({
  head: () => ({ meta: [{ title: "Notifications — SMC Pulse" }] }),
  component: NotificationsPage,
});

const FILTERS = ["All", "Action Required", "Research Update", "Commentary", "Account"] as const;

function NotificationsPage() {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const visible = filter === "All" ? items : items.filter((n) => n.group === filter);
  const unread = items.filter((n) => !n.read).length;

  return (
    <PortalShell portal="client">
      <PageHeader
        title="Notifications"
        subtitle={`${unread} unread · grouped by priority`}
        right={
          unread > 0 && (
            <button
              onClick={() => setItems((arr) => arr.map((n) => ({ ...n, read: true })))}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-[12px] font-medium text-muted-foreground hover:bg-secondary"
            >
              <CheckCheck className="size-3.5" /> Mark all read
            </button>
          )
        }
      />

      <div className="mb-3 -mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "shrink-0 rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors",
              filter === f
                ? "bg-[var(--smc-blue)] text-white"
                : "bg-secondary text-muted-foreground hover:bg-accent",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyView title="You're all caught up" hint="New research updates and recommendations will appear here." />
      ) : (
        <ul className="space-y-2">
          {visible.map((n) => (
            <li key={n.id}>
              <Link
                to={n.href}
                onClick={() => setItems((arr) => arr.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
                className={cn(
                  "grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-[var(--smc-teal)]/40",
                  !n.read && "ring-1 ring-[var(--smc-blue)]/10",
                )}
              >
                <span
                  className={cn(
                    "mt-1 size-2 shrink-0 rounded-full",
                    n.priority === "HIGH"
                      ? "bg-[var(--warning)]"
                      : n.priority === "MEDIUM"
                        ? "bg-[var(--smc-blue)]"
                        : "bg-muted-foreground/40",
                  )}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                    <Bell className="size-3" />
                    <span>{n.group}</span>
                    <span>· {relativeTime(n.at)}</span>
                  </div>
                  <p className="mt-0.5 text-[14px] font-semibold text-foreground">{n.title}</p>
                  <p className="text-[12px] text-muted-foreground">{n.body}</p>
                </div>
                <ChevronRight className="size-4 self-center text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}