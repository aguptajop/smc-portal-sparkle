import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import { products } from "@/lib/mock-data";
import { Check, Eye, Save } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analyst/create")({
  head: () => ({
    meta: [
      { title: "Create recommendation — SMC Pulse Analyst" },
      {
        name: "description",
        content: "Publish a new research recommendation across equity, options or commodity.",
      },
      { property: "og:title", content: "Create recommendation — SMC Pulse" },
      { property: "og:description", content: "Compose, validate and publish a research call." },
    ],
  }),
  component: CreateRec,
});

type AC = "EQUITY" | "INDEX_OPTION" | "STOCK_OPTION" | "COMMODITY";

const ASSETS: { id: AC; label: string; helper: string }[] = [
  { id: "EQUITY", label: "Equity", helper: "Cash market — stock" },
  { id: "INDEX_OPTION", label: "Index option", helper: "Nifty / Bank Nifty" },
  { id: "STOCK_OPTION", label: "Stock option", helper: "Single-stock options" },
  { id: "COMMODITY", label: "Commodity", helper: "MCX futures" },
];

function CreateRec() {
  const [asset, setAsset] = useState<AC>("EQUITY");
  const [productId, setProductId] = useState(products[0]!.id);
  const [direction, setDirection] = useState<"BUY" | "SELL">("BUY");
  const [conviction, setConviction] = useState<"High" | "Medium" | "Tactical">("High");
  const [autosaved, setAutosaved] = useState(true);

  return (
    <PortalShell portal="analyst" title="Create recommendation">
      <PageHeader
        title="Create recommendation"
        subtitle="Compose, validate, then publish to subscribers."
        right={
          <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-[11px] text-muted-foreground">
            {autosaved ? (
              <>
                <Check className="size-3 text-[var(--success)]" /> Draft auto-saved
              </>
            ) : (
              <>
                <Save className="size-3" /> Saving…
              </>
            )}
          </span>
        }
      />

      <SectionLabel>Product</SectionLabel>
      <div className="grid gap-2 sm:grid-cols-2">
        {products
          .filter((p) => p.subscribed)
          .map((p) => (
            <button
              key={p.id}
              onClick={() => setProductId(p.id)}
              className={cn(
                "rounded-lg border bg-card p-3 text-left transition-colors",
                productId === p.id
                  ? "border-[var(--smc-teal)] ring-1 ring-[var(--smc-teal)]/30"
                  : "border-border hover:border-[var(--smc-teal)]/40",
              )}
            >
              <p className="text-[13px] font-semibold text-foreground">{p.name}</p>
              <p className="text-[11px] text-muted-foreground">{p.tagline}</p>
            </button>
          ))}
      </div>

      <SectionLabel>Asset class</SectionLabel>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ASSETS.map((a) => (
          <button
            key={a.id}
            onClick={() => setAsset(a.id)}
            className={cn(
              "rounded-md border bg-card px-3 py-2 text-left text-[12px] transition-colors",
              asset === a.id
                ? "border-[var(--smc-blue)] bg-accent"
                : "border-border hover:border-[var(--smc-teal)]/40",
            )}
          >
            <p className="font-semibold text-foreground">{a.label}</p>
            <p className="text-[10px] text-muted-foreground">{a.helper}</p>
          </button>
        ))}
      </div>

      <SectionLabel>Direction & conviction</SectionLabel>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-3">
          <p className="text-[11px] font-medium text-muted-foreground">Direction</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["BUY", "SELL"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDirection(d)}
                className={cn(
                  "rounded-md py-2 text-[13px] font-semibold transition-colors",
                  direction === d
                    ? d === "BUY"
                      ? "bg-[var(--success-soft)] text-[var(--success)] ring-1 ring-[var(--success)]/30"
                      : "bg-[var(--danger-soft)] text-[var(--danger)] ring-1 ring-[var(--danger)]/30"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <p className="text-[11px] font-medium text-muted-foreground">Conviction</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["High", "Medium", "Tactical"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setConviction(c)}
                className={cn(
                  "rounded-md py-2 text-[12px] font-semibold transition-colors",
                  conviction === c
                    ? "bg-[var(--smc-blue)] text-white"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <SectionLabel>{labelFor(asset)} fields</SectionLabel>
      <div className="grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-2">
        <Field label="Instrument" placeholder={placeholderFor(asset)} />
        {(asset === "INDEX_OPTION" || asset === "STOCK_OPTION") && (
          <>
            <Field label="Strike" placeholder="25500" />
            <Field label="Option type (CE/PE)" placeholder="CE" />
            <Field label="Expiry" placeholder="26 Jun 2026" />
          </>
        )}
        {asset === "COMMODITY" && <Field label="Expiry" placeholder="19 Jun 2026" />}
        <Field label="Entry" placeholder="e.g. 2,845 – 2,855" />
        <Field label="Stop loss" placeholder="2,798" />
        <Field label="Target 1" placeholder="2,910" />
        <Field label="Target 2 (optional)" placeholder="2,955" />
      </div>

      <SectionLabel>Research rationale</SectionLabel>
      <textarea
        onChange={() => setAutosaved(false)}
        onBlur={() => setAutosaved(true)}
        rows={4}
        placeholder="What is the thesis? What invalidates it?"
        className="w-full rounded-lg border border-border bg-card p-3 text-[13px] outline-none ring-0 placeholder:text-muted-foreground/70 focus:border-[var(--smc-teal)]"
      />

      <div className="mt-6 rounded-lg border border-border bg-secondary/60 p-4 text-[12px]">
        <p className="font-semibold text-foreground">Visibility</p>
        <p className="mt-1 text-muted-foreground">
          Visible to{" "}
          <span className="font-semibold text-foreground">
            {products.find((p) => p.id === productId)?.name} subscribers
          </span>{" "}
          on Activity Center and Product Detail.
        </p>
      </div>

      {/* Sticky action bar */}
      <div className="sticky bottom-16 z-30 mt-6 -mx-4 border-t border-border bg-card/95 px-4 py-3 backdrop-blur lg:bottom-0">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2">
          <Link
            to="/analyst/preview"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-[13px] font-medium text-foreground hover:bg-secondary"
          >
            <Eye className="size-4" /> Preview as client
          </Link>
          <div className="flex items-center gap-2">
            <button className="rounded-md border border-border bg-card px-3 py-2 text-[13px] font-medium text-foreground hover:bg-secondary">
              Save draft
            </button>
            <button className="rounded-md bg-[var(--smc-blue)] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[var(--smc-blue-dark)]">
              Publish recommendation
            </button>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      <input
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-[13px] tabular outline-none placeholder:text-muted-foreground/70 focus:border-[var(--smc-teal)]"
      />
    </label>
  );
}

function labelFor(a: AC) {
  return a === "EQUITY"
    ? "Equity"
    : a === "INDEX_OPTION"
      ? "Index option"
      : a === "STOCK_OPTION"
        ? "Stock option"
        : "Commodity";
}
function placeholderFor(a: AC) {
  return a === "EQUITY"
    ? "RELIANCE"
    : a === "INDEX_OPTION"
      ? "NIFTY"
      : a === "STOCK_OPTION"
        ? "HDFCBANK"
        : "CRUDEOIL";
}