import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import { recommendations, commentaries } from "@/lib/mock-data";
import { CommentaryCard, RecommendationCard } from "@/components/pulse/cards";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/analyst/preview")({
  head: () => ({
    meta: [
      { title: "Preview client experience — SMC Pulse Analyst" },
      {
        name: "description",
        content: "See exactly what your subscribers will see before you publish.",
      },
    ],
  }),
  component: Preview,
});

function Preview() {
  const sampleRec = recommendations[0]!;
  const sampleComm = commentaries.find((c) => c.pinned) ?? commentaries[0]!;

  return (
    <PortalShell portal="analyst" title="Preview as client">
      <PageHeader
        title="Preview client experience"
        subtitle="What your subscribers will see on mobile, before you publish."
        right={
          <Link
            to="/client"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-[12px] font-medium hover:bg-secondary"
          >
            <ExternalLink className="size-3.5" /> Open full client portal
          </Link>
        }
      />

      <SectionLabel>Mobile preview</SectionLabel>
      <div className="grid gap-6 sm:grid-cols-[auto_minmax(0,1fr)]">
        {/* Phone frame */}
        <div className="mx-auto w-[320px] shrink-0 rounded-[2rem] border border-border bg-card p-3 shadow-[0_8px_30px_-12px_rgba(0,58,112,0.18)]">
          <div className="rounded-[1.4rem] bg-background p-3">
            <div className="mb-2 flex items-center justify-between px-1 text-[10px] font-semibold text-muted-foreground tabular">
              <span>9:41</span>
              <span>SMC Pulse</span>
            </div>
            <div className="space-y-3">
              <CommentaryCard c={sampleComm} expanded />
              <RecommendationCard rec={sampleRec} compact />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-lg border border-border bg-card p-4 text-[13px] leading-relaxed text-foreground/90">
          <h3 className="text-[14px] font-semibold text-foreground">Preview checklist</h3>
          <ul className="mt-2 space-y-1 text-[13px] text-foreground/85">
            <li>· Headline communicates the change in &lt;1 second.</li>
            <li>· Latest action is unambiguous (Book / Trail / Exit).</li>
            <li>· Entry, SL and targets are tabular and aligned.</li>
            <li>· Pinned commentary is visually distinct but not noisy.</li>
            <li>· No marketing aesthetics, no excessive motion.</li>
          </ul>
          <p className="mt-3 text-[12px] text-muted-foreground">
            Always preview a Critical Research Update before publish — the pinned slot is shared
            across the product.
          </p>
        </div>
      </div>
    </PortalShell>
  );
}