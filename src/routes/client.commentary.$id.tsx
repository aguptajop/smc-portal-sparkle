import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PortalShell } from "@/components/pulse/portal-shell";
import { ProductBadge } from "@/components/pulse/product-badge";
import { ReactionBar } from "@/components/pulse/reactions";
import { getCommentary, getProduct, relativeTime } from "@/lib/mock-data";
import { ArrowLeft, Pin } from "lucide-react";

export const Route = createFileRoute("/client/commentary/$id")({
  loader: ({ params }) => {
    const c = getCommentary(params.id);
    if (!c) throw notFound();
    return { c };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.c.title ?? "Commentary"} — SMC Pulse` },
      { name: "description", content: loaderData?.c.preview ?? "Research commentary from SMC." },
      { property: "og:title", content: loaderData?.c.title ?? "Commentary" },
      { property: "og:description", content: loaderData?.c.preview ?? "" },
    ],
  }),
  component: CommentaryDetail,
});

function CommentaryDetail() {
  const { c } = Route.useLoaderData();
  const product = getProduct(c.productId);
  return (
    <PortalShell portal="client" title={c.type}>
      <Link
        to="/client/product/$id"
        params={{ id: c.productId }}
        className="mb-3 inline-flex min-h-9 items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back
      </Link>

      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
        {product && <ProductBadge product={product} />}
        {c.pinned && (
          <span className="inline-flex items-center gap-1 text-[var(--smc-teal)]">
            <Pin className="size-3" /> Pinned
          </span>
        )}
        <span className="text-[var(--smc-blue)]">{c.type}</span>
        <span className="text-muted-foreground">· {relativeTime(c.publishedAt)}</span>
      </div>

      <h1 className="mt-2 text-[22px] font-bold leading-tight text-foreground sm:text-[26px]">
        {c.title}
      </h1>

      <article className="mt-4 space-y-4 text-[14px] leading-relaxed text-foreground/90">
        {c.body.split("\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </article>

      <ReactionBar />

      <div className="mt-6 rounded-lg border border-border bg-card p-4 text-[12px] text-muted-foreground">
        Published by <span className="font-semibold text-foreground">SMC Research Desk</span>
        <span className="mx-1">·</span>
        {product?.name ?? "—"}
      </div>
    </PortalShell>
  );
}