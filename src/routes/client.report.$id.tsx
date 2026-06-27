import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PortalShell } from "@/components/pulse/portal-shell";
import { ProductBadge } from "@/components/pulse/product-badge";
import { ReactionBar } from "@/components/pulse/reactions";
import { getProduct } from "@/lib/mock-data";
import { reports } from "@/lib/pulse-data";
import { ArrowLeft, Download, FileText } from "lucide-react";

export const Route = createFileRoute("/client/report/$id")({
  loader: ({ params }) => {
    const r = reports.find((x) => x.id === params.id);
    if (!r) throw notFound();
    return { r };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.r.title ?? "Report"} — SMC Pulse` },
      { name: "description", content: loaderData?.r.preview ?? "SMC research report." },
    ],
  }),
  component: ReportDetail,
});

function ReportDetail() {
  const { r } = Route.useLoaderData();
  const product = r.productId ? getProduct(r.productId) : undefined;
  return (
    <PortalShell portal="client" title="Report">
      <Link
        to="/client/activity"
        className="mb-3 inline-flex min-h-9 items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back
      </Link>

      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
        {product && <ProductBadge product={product} />}
        <span className="inline-flex items-center gap-1 text-[var(--smc-blue)]">
          <FileText className="size-3" /> {r.type}
        </span>
      </div>

      <h1 className="mt-2 text-[22px] font-bold leading-tight text-foreground sm:text-[26px]">
        {r.title}
      </h1>
      <p className="mt-2 text-[14px] leading-relaxed text-foreground/85">{r.preview}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-border bg-card p-4 text-[12px] sm:grid-cols-4">
        <Meta k="Analyst" v={r.analyst} />
        <Meta k="Pages" v={String(r.pages)} />
        <Meta k="Published" v={new Date(r.publishedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} />
        <Meta k="Category" v={r.type} />
      </div>

      <button className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md bg-[var(--smc-blue)] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[var(--smc-blue-dark)]">
        <Download className="size-4" /> Download PDF
      </button>

      <ReactionBar />
    </PortalShell>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</p>
      <p className="font-semibold text-foreground">{v}</p>
    </div>
  );
}