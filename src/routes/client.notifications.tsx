import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import { EmptyView } from "@/components/pulse/states";
import { type Notification, notifications as initial, relativeTime } from "@/lib/pulse-data";
import { ChevronRight, Bell, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/client/notifications")({
  head: () => ({ meta: [{ title: "Notifications — SMC Pulse" }] }),
  component: NotificationsPage,
});

function bucket(iso: string): "Today" | "Yesterday" | "This Week" | "Earlier" {
  const diffH = (Date.now() - +new Date(iso)) / 3600_000;
  if (diffH < 24) return "Today";
  if (diffH < 48) return "Yesterday";
  if (diffH < 7 * 24) return "This Week";
  return "Earlier";
}

function NotificationsPage() {
  const [items, setItems] = useState(initial);
  const unread = items.filter((n) => !n.read).length;

  const groups = useMemo(() => {
    const order: ("Today" | "Yesterday" | "This Week" | "Earlier")[] = [
      "Today",
      "Yesterday",
      "This Week",
      "Earlier",
    ];
    return order
      .map((g) => ({ g, items: items.filter((n) => bucket(n.at) === g) }))
      .filter((x) => x.items.length > 0);
  }, [items]);

  return (
    <PortalShell portal="client" title="Notifications">
      <PageHeader
        title="Notifications"
        subtitle={unread > 0 ? `${unread} unread` : "You're all caught up"}
        right={
          unread > 0 && (
            <button
              onClick={() => setItems((arr) => arr.map((n) => ({ ...n, read: true })))}
              className="inline-flex min-h-9 items-center gap-1 rounded-md border border-border px-2.5 py-1 text-[12px] font-medium text-muted-foreground hover:bg-secondary"
            >
              <CheckCheck className="size-3.5" /> Mark all read
            </button>
          )
        }
      />

      {groups.length === 0 ? (
        <EmptyView
          title="You're all caught up"
          hint="New research updates, action items and commentary will appear here."
        />
      ) : (
        groups.map(({ g, items: list }) => (
          <section key={g}>
            <SectionLabel hint={`${list.length}`}>{g}</SectionLabel>
            <ul className="space-y-2">
              {list.map((n) => (
                <NotificationRow
                  key={n.id}
                  n={n}
                  onRead={() =>
                    setItems((arr) => arr.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
                  }
                />
              ))}
            </ul>
          </section>
        ))
      )}
    </PortalShell>
  );
}

function NotificationRow({ n, onRead }: { n: Notification; onRead: () => void }) {
  return (
    <li>
      <Link
        to={n.href}
        onClick={onRead}
        className={cn(
          "grid min-h-[56px] grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-[var(--smc-teal)]/40",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "mt-1 size-2 shrink-0 rounded-full",
            !n.read ? "bg-[var(--smc-teal)]" : "bg-transparent",
          )}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            <Bell className="size-3" />
            <span>{n.group}</span>
            <span>· {relativeTime(n.at)}</span>
          </div>
          <p className={cn("mt-0.5 text-[14px] text-foreground", !n.read ? "font-bold" : "font-semibold")}>
            {n.title}
          </p>
          <p className="text-[12px] text-muted-foreground">{n.body}</p>
        </div>
        <ChevronRight className="size-4 self-center text-muted-foreground" />
      </Link>
    </li>
  );
}