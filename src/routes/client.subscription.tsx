import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import { invoices, plans, subscriptions, relativeTime } from "@/lib/pulse-data";
import { products } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Receipt, RefreshCw, Plus } from "lucide-react";

export const Route = createFileRoute("/client/subscription")({
  head: () => ({ meta: [{ title: "Subscription — SMC Pulse" }] }),
  component: SubscriptionPage,
});

function SubscriptionPage() {
  return (
    <PortalShell portal="client">
      <PageHeader
        title="Subscription & billing"
        subtitle="Manage entitlements, renewals and invoices"
        right={
          <Link
            to="/onboarding/subscribe"
            className="inline-flex items-center gap-1 rounded-md bg-[var(--smc-blue)] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[var(--smc-blue-dark)]"
          >
            <Plus className="size-3.5" /> Add product
          </Link>
        }
      />

      <SectionLabel hint={`${subscriptions.length} active`}>Active subscriptions</SectionLabel>
      <div className="grid gap-3">
        {subscriptions.map((s) => {
          const p = products.find((x) => x.id === s.productId)!;
          const pl = plans.find((x) => x.id === s.planId)!;
          const daysToRenew = Math.ceil((+new Date(s.renewsAt) - Date.now()) / 86400_000);
          return (
            <article key={s.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-semibold text-foreground">{p.name}</h3>
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase",
                        s.status === "ACTIVE"
                          ? "bg-[var(--success-soft)] text-[var(--success)]"
                          : s.status === "EXPIRING"
                            ? "bg-[var(--warning-soft)] text-[var(--warning)]"
                            : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {s.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">
                    {pl.interval} · ₹{(pl.price + pl.gst).toLocaleString("en-IN")} · {s.channel}
                  </p>
                  <p className="mt-1 text-[12px]">
                    {s.status === "EXPIRING" ? (
                      <span className="text-[var(--warning)] font-semibold">Renews in {daysToRenew} day{daysToRenew === 1 ? "" : "s"}</span>
                    ) : (
                      <span className="text-muted-foreground">Next renewal {relativeTime(s.renewsAt)}</span>
                    )}
                    {" · "}
                    Auto-renew {s.autoRenew ? "ON" : "OFF"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button className="rounded-md border border-border px-2.5 py-1 text-[12px] font-medium text-foreground hover:bg-secondary">
                    {s.autoRenew ? "Pause auto-renew" : "Enable auto-renew"}
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-md bg-[var(--smc-blue)] px-3 py-1 text-[12px] font-semibold text-white hover:bg-[var(--smc-blue-dark)]">
                    <RefreshCw className="size-3" /> Renew
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <SectionLabel>Invoices</SectionLabel>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-secondary/50 text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-semibold">Invoice</th>
              <th className="px-4 py-2 font-semibold">Product</th>
              <th className="px-4 py-2 font-semibold">Date</th>
              <th className="px-4 py-2 text-right font-semibold">Amount</th>
              <th className="px-4 py-2 text-right font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-t border-border">
                <td className="px-4 py-2.5 font-medium text-foreground tabular">{inv.number}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{inv.productName}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{relativeTime(inv.date)}</td>
                <td className="px-4 py-2.5 text-right font-semibold text-foreground tabular">₹{inv.amount.toLocaleString("en-IN")}</td>
                <td className="px-4 py-2.5 text-right">
                  <span className="inline-flex items-center gap-1 rounded-md bg-[var(--success-soft)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--success)]">
                    <Receipt className="size-3" /> {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PortalShell>
  );
}