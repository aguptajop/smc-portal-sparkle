import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PortalShell } from "@/components/pulse/portal-shell";
import { ProductBadge } from "@/components/pulse/product-badge";
import { type Poll, getPoll, getProduct } from "@/lib/mock-data";
import { ArrowLeft, Check, Vote } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/client/poll/$id")({
  loader: ({ params }) => {
    const p = getPoll(params.id);
    if (!p) throw notFound();
    return { p };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.p.question ?? "Poll"} — SMC Pulse` },
      { name: "description", content: "Live SMC research poll." },
    ],
  }),
  component: PollDetail,
});

function PollDetail() {
  const { p } = Route.useLoaderData() as { p: Poll };
  const product = getProduct(p.productId);
  const [voted, setVoted] = useState<string | null>(p.userVote ?? null);
  const [selected, setSelected] = useState<string | null>(null);
  const totalVotes = p.totalVotes + (voted && !p.userVote ? 1 : 0);
  const closesInH = Math.max(0, Math.round((+new Date(p.closesAt) - Date.now()) / 3600_000));
  const closed = closesInH === 0;

  return (
    <PortalShell portal="client" title="Poll">
      <Link
        to="/client/activity"
        className="mb-3 inline-flex min-h-9 items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to activity
      </Link>

      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
        {product && <ProductBadge product={product} />}
        <span className="inline-flex items-center gap-1 text-[var(--smc-blue)]">
          <Vote className="size-3" /> Poll
        </span>
      </div>
      <h1 className="mt-2 text-[20px] font-bold leading-tight text-foreground sm:text-[24px]">
        {p.question}
      </h1>

      <div className="mt-4 space-y-2">
        {p.options.map((o) => {
          const isVoted = voted === o.id;
          const showResults = !!voted || closed;
          const liveVotes = o.votes + (isVoted && voted !== p.userVote ? 1 : 0);
          const pct = totalVotes === 0 ? 0 : Math.round((liveVotes / totalVotes) * 100);
          if (!showResults) {
            return (
              <button
                key={o.id}
                onClick={() => setSelected(o.id)}
                className={cn(
                  "flex w-full min-h-11 items-center gap-3 rounded-lg border bg-card px-4 py-3 text-left text-[14px] transition-colors",
                  selected === o.id
                    ? "border-[var(--smc-teal)] ring-1 ring-[var(--smc-teal)]/30"
                    : "border-border hover:border-[var(--smc-teal)]/40",
                )}
              >
                <span
                  className={cn(
                    "grid size-4 place-items-center rounded-full border",
                    selected === o.id ? "border-[var(--smc-teal)] bg-[var(--smc-teal)]" : "border-border",
                  )}
                >
                  {selected === o.id && <span className="size-1.5 rounded-full bg-white" />}
                </span>
                <span className="text-foreground">{o.label}</span>
              </button>
            );
          }
          return (
            <div
              key={o.id}
              className="relative overflow-hidden rounded-lg border border-border bg-card px-4 py-3"
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-0 left-0 transition-[width] duration-500",
                  isVoted ? "bg-[#E0F7FA]" : "bg-secondary",
                )}
                style={{ width: `${pct}%` }}
              />
              <div className="relative flex items-center justify-between gap-2 text-[14px]">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  {isVoted && <Check className="size-3.5 text-[var(--smc-teal)]" />}
                  {o.label}
                </span>
                <span className="tabular font-semibold text-foreground">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {!voted && !closed && (
        <button
          disabled={!selected}
          onClick={() => setVoted(selected)}
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--smc-blue)] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[var(--smc-blue-dark)] disabled:opacity-50"
        >
          Vote
        </button>
      )}

      <p className="mt-4 text-[12px] text-muted-foreground tabular">
        {totalVotes} votes · {closed ? "Poll ended" : `Closes in ${closesInH} hours`}
      </p>
    </PortalShell>
  );
}