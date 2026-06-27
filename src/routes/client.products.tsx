import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import { actionRequiredCount, activeCount, products } from "@/lib/mock-data";
import { subscriptionFor } from "@/lib/pulse-data";
import { ChevronRight, Lock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/client/products")({
  head: () => ({
    meta: [
      { title: "Products — SMC Pulse" },
      { name: "description", content: "Subscribed products, available products and tools." },
      { property: "og:title", content: "SMC Pulse — Products" },
      { property: "og:description", content: "Manage your SMC research subscriptions." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const subscribed = products.filter((p) => p.subscribed);
  const available = products.filter((p) => !p.subscribed);

  return (
    <PortalShell portal="client" title="Products">
      <PageHeader
        title="Products"
        subtitle="Your subscribed research and what else SMC publishes."
      />

      <SectionLabel hint={`${subscribed.length} active`}>Your subscriptions</SectionLabel>
      <div className="space-y-3">
        {subscribed.map((p) => {
          const ar = actionRequiredCount(p.id);
          const act = activeCount(p.id);
          const sub = subscriptionFor(p.id);
          return (
            <Link
              key={p.id}
              to="/client/product/$id"
              params={{ id: p.id }}
              className="group block rounded-lg border border-border bg-card p-4 transition-colors hover:border-[var(--smc-teal)]/40"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[15px] font-semibold text-foreground">{p.name}</h3>
                    {ar > 0 ? (
                      <span className="rounded-sm bg-[var(--warning-soft)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--warning)]">
                        {ar} action
                      </span>
                    ) : (
                      <span className="rounded-sm bg-[var(--success-soft)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--success)]">
                        {act} active
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">
                    {p.holdingHorizon} · {p.riskProfile} risk
                  </p>
                  <p className="mt-2 text-[11px] text-muted-foreground tabular">
                    Valid until {p.validUntil ?? "—"}
                    {sub?.status === "EXPIRING" && (
                      <span className="ml-2 inline-flex items-center rounded bg-[var(--warning-soft)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--warning)]">
                        Renew soon
                      </span>
                    )}
                  </p>
                </div>
                <ChevronRight className="size-4 self-center text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}
      </div>

      {available.length > 0 && (
        <>
          <SectionLabel>Available</SectionLabel>
          <div className="space-y-3">
            {available.map((p) => (
              <article
                key={p.id}
                className="rounded-lg border border-border bg-card p-4 opacity-95"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-semibold text-foreground">{p.name}</h3>
                      <span className="inline-flex items-center gap-1 rounded-sm bg-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <Lock className="size-3" /> Locked
                      </span>
                    </div>
                    <p className="mt-0.5 text-[12px] text-muted-foreground">
                      {p.holdingHorizon} · {p.riskProfile} risk
                    </p>
                    <p className="mt-1 text-[12px] text-muted-foreground">{p.tagline}</p>
                  </div>
                  <Link
                    to="/onboarding/subscribe"
                    className="shrink-0 rounded-md bg-[var(--smc-blue)] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[var(--smc-blue-dark)]"
                  >
                    Subscribe
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <SectionLabel>Tools</SectionLabel>
      <a
        href="https://autotrender.smcindiaonline.com"
        target="_blank"
        rel="noreferrer"
        className={cn(
          "flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors",
          "hover:border-[var(--smc-teal)]/40",
        )}
      >
        <div>
          <p className="text-[15px] font-semibold text-foreground">Autotrender</p>
          <p className="text-[12px] text-muted-foreground">Independent analytics workbench · Active until 15 Mar 2026</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-3 py-1.5 text-[12px] font-semibold text-foreground">
          Launch <ExternalLink className="size-3" />
        </span>
      </a>
    </PortalShell>
  );
}