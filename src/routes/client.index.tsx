import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import {
  PinnedCommentary,
  RecommendationCard,
} from "@/components/pulse/cards";
import { EmptyView } from "@/components/pulse/states";
import {
  ProductSwitcher,
  ProductSwitcherBar,
  type ProductScope,
} from "@/components/pulse/product-switcher";
import {
  newSince,
  pinnedCommentary,
  products,
  recentlyClosed,
  recommendations,
} from "@/lib/mock-data";

export const Route = createFileRoute("/client/")({
  head: () => ({
    meta: [
      { title: "Home — SMC Pulse" },
      {
        name: "description",
        content:
          "Action required, new research since your last visit, and active positions for your subscribed SMC research products.",
      },
      { property: "og:title", content: "SMC Pulse — Home" },
      {
        property: "og:description",
        content: "Research-first workspace: what changed, what's active, what needs action.",
      },
    ],
  }),
  component: ClientHome,
});

function ClientHome() {
  const subscribed = useMemo(() => products.filter((p) => p.subscribed), []);
  const defaultScope: ProductScope =
    subscribed.find((p) => recommendations.some((r) => r.productId === p.id && r.status === "ACTION_REQUIRED"))
      ?.id ?? subscribed[0]?.id ?? "all";

  const [scope, setScope] = useState<ProductScope>(defaultScope);

  if (subscribed.length === 0) {
    return (
      <PortalShell portal="client">
        <EmptyView
          title="No active subscriptions"
          hint="Visit the Products tab to subscribe to a research product."
        />
      </PortalShell>
    );
  }

  const filtered = (arr: typeof recommendations) =>
    scope === "all" ? arr : arr.filter((r) => r.productId === scope);

  const action = filtered(recommendations).filter((r) => r.status === "ACTION_REQUIRED");
  // "New since last visit" — last 24h of new recommendations, excluding action-required dupes
  const newRecs = filtered(newSince(24)).filter(
    (r) => !action.some((a) => a.id === r.id) && r.status !== "CLOSED" && r.status !== "CLOSED_WIN" && r.status !== "CLOSED_LOSS",
  );
  const active = filtered(recommendations)
    .filter((r) => (r.status === "ACTIVE" || r.status === "PARTIAL"))
    .filter((r) => !newRecs.some((n) => n.id === r.id));
  const closed = scope === "all" ? recentlyClosed(undefined, 3) : recentlyClosed(scope, 3);

  const pinned =
    scope === "all"
      ? subscribed.map((p) => pinnedCommentary(p.id)).find(Boolean)
      : pinnedCommentary(scope);

  const showProductBadge = scope === "all";

  return (
    <PortalShell
      portal="client"
      headerSlot={<ProductSwitcher value={scope} onChange={setScope} />}
      subBar={
        <div className="hidden lg:block">
          <ProductSwitcherBar value={scope} onChange={setScope} />
        </div>
      }
    >
      {/* Tier 1 — Action Required */}
      {action.length > 0 && (
        <>
          <SectionLabel hint={`${action.length} item${action.length === 1 ? "" : "s"}`}>
            Action required
          </SectionLabel>
          <div className="space-y-3">
            {action.map((r) => (
              <RecommendationCard key={r.id} rec={r} showProductBadge={showProductBadge} compact />
            ))}
          </div>
        </>
      )}

      {/* Tier 2 — New Since Last Visit */}
      {newRecs.length > 0 && (
        <>
          <SectionLabel hint={`${newRecs.length} new`}>New since last visit</SectionLabel>
          <div className="space-y-3">
            {newRecs.map((r) => (
              <RecommendationCard key={r.id} rec={r} showProductBadge={showProductBadge} compact />
            ))}
          </div>
        </>
      )}

      {/* Tier 3 — Active Positions */}
      <SectionLabel hint={`${active.length} open`}>Active positions</SectionLabel>
      {active.length === 0 ? (
        <EmptyView title="No active positions" hint="New recommendations appear here as soon as the desk publishes." />
      ) : (
        <div className="space-y-3">
          {active.map((r) => (
            <RecommendationCard key={r.id} rec={r} showProductBadge={showProductBadge} compact />
          ))}
        </div>
      )}

      {/* Tier 4 — Pinned commentary */}
      {pinned && (
        <>
          <SectionLabel>Pinned commentary</SectionLabel>
          <PinnedCommentary c={pinned} />
        </>
      )}

      {/* Tier 5 — Recently closed */}
      {closed.length > 0 && (
        <>
          <SectionLabel hint="Last 7 days">Recently closed</SectionLabel>
          <div className="space-y-3">
            {closed.map((r) => (
              <RecommendationCard key={r.id} rec={r} showProductBadge={showProductBadge} compact />
            ))}
          </div>
        </>
      )}
    </PortalShell>
  );
}