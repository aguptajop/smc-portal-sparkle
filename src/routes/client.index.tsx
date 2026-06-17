import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import { NeedAttentionBanner, ResearchContinuityBanner } from "@/components/pulse/banners";
import { ProductCard } from "@/components/pulse/cards";
import { products, recommendations } from "@/lib/mock-data";

export const Route = createFileRoute("/client/")({
  head: () => ({
    meta: [
      { title: "Home — SMC Pulse Client" },
      {
        name: "description",
        content: "Your research home: action required, what changed since your last visit, and active recommendations across subscribed products.",
      },
      { property: "og:title", content: "SMC Pulse — Client Home" },
      { property: "og:description", content: "Active research and recommendations at a glance." },
    ],
  }),
  component: ClientHome,
});

function actionFor(pid: string) {
  return recommendations.filter((r) => r.productId === pid && r.status === "ACTION_REQUIRED")
    .length;
}

function ClientHome() {
  // Ordering: subscribed-with-action → subscribed-active → subscribed-no-update → not subscribed
  const ordered = [...products].sort((a, b) => {
    const score = (p: typeof products[number]) => {
      if (!p.subscribed) return 3;
      if (actionFor(p.id) > 0) return 0;
      if (p.researchStatus === "Active Today") return 1;
      return 2;
    };
    return score(a) - score(b);
  });

  return (
    <PortalShell portal="client">
      <PageHeader
        title="Good morning, Aditya"
        subtitle="Here is what changed and what needs your attention today."
      />

      <div className="space-y-3">
        <ResearchContinuityBanner />
        <NeedAttentionBanner />
      </div>

      <SectionLabel hint={`${ordered.filter((p) => p.subscribed).length} subscribed`}>
        Your products
      </SectionLabel>
      <div className="grid gap-3 sm:grid-cols-2">
        {ordered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </PortalShell>
  );
}