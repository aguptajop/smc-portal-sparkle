import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, ChevronLeft, CreditCard, ShieldCheck } from "lucide-react";
import { plans, type Plan } from "@/lib/pulse-data";
import { products } from "@/lib/mock-data";

export const Route = createFileRoute("/onboarding/subscribe")({
  head: () => ({ meta: [{ title: "Subscribe — SMC Pulse" }] }),
  component: SubscribeFlow,
});

function SubscribeFlow() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Plan>(plans[1]);
  const [step, setStep] = useState<"plan" | "pay" | "done">("plan");

  const product = products.find((p) => p.id === selected.productId)!;
  const total = selected.price + selected.gst;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center gap-3 px-4">
          <Link to="/client" className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-secondary">
            <ChevronLeft className="size-4" />
          </Link>
          <div className="text-[13px] font-semibold text-foreground">Subscribe</div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {step === "plan" && (
          <>
            <h1 className="text-[22px] font-bold text-foreground">Choose a research product</h1>
            <p className="mt-1 text-[13px] text-muted-foreground">Activated immediately after KYC. Cancel anytime.</p>

            {products.map((p) => {
              const productPlans = plans.filter((pl) => pl.productId === p.id);
              if (productPlans.length === 0) return null;
              return (
                <section key={p.id} className="mt-6">
                  <header className="flex items-baseline justify-between">
                    <h2 className="text-[15px] font-semibold text-foreground">{p.name}</h2>
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{p.holdingHorizon}</span>
                  </header>
                  <p className="text-[12px] text-muted-foreground">{p.tagline}</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {productPlans.map((pl) => {
                      const active = selected.id === pl.id;
                      return (
                        <button
                          key={pl.id}
                          type="button"
                          onClick={() => setSelected(pl)}
                          className={`text-left rounded-lg border bg-card p-4 transition-colors ${
                            active ? "border-[var(--smc-blue)] ring-2 ring-[var(--smc-blue)]/15" : "border-border hover:border-[var(--smc-teal)]/40"
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider">
                            <span className="text-muted-foreground">{pl.interval}</span>
                            {pl.popular && <span className="rounded-md bg-[var(--smc-teal)]/15 px-1.5 py-0.5 text-[10px] text-[var(--smc-teal)]">Popular</span>}
                          </div>
                          <p className="mt-1.5 text-[20px] font-bold text-foreground tabular">
                            ₹{pl.price.toLocaleString("en-IN")}
                          </p>
                          <p className="text-[11px] text-muted-foreground">+ ₹{pl.gst.toLocaleString("en-IN")} GST</p>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            <div className="sticky bottom-0 mt-8 -mx-4 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
              <div className="mx-auto flex max-w-4xl items-center gap-3">
                <div className="min-w-0 text-[12px]">
                  <p className="font-semibold text-foreground">{product.name} · {selected.interval}</p>
                  <p className="text-muted-foreground">Total ₹{total.toLocaleString("en-IN")} (incl. GST)</p>
                </div>
                <button
                  onClick={() => setStep("pay")}
                  className="ml-auto rounded-md bg-[var(--smc-blue)] px-5 py-2 text-[13px] font-semibold text-white hover:bg-[var(--smc-blue-dark)]"
                >
                  Continue to payment
                </button>
              </div>
            </div>
          </>
        )}

        {step === "pay" && (
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <div className="space-y-3 rounded-lg border border-border bg-card p-5">
              <h2 className="text-[15px] font-semibold text-foreground">Payment method</h2>
              {["UPI", "Net Banking", "Debit / Credit Card"].map((m, i) => (
                <label key={m} className="flex items-center gap-3 rounded-md border border-border p-3 hover:bg-secondary/50">
                  <input type="radio" name="pay" defaultChecked={i === 0} className="accent-[var(--smc-blue)]" />
                  <CreditCard className="size-4 text-muted-foreground" />
                  <span className="text-[13px] font-medium text-foreground">{m}</span>
                </label>
              ))}
              <p className="flex items-center gap-1.5 pt-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="size-3.5 text-[var(--success)]" /> Payments are PCI-DSS compliant and processed by Razorpay.
              </p>
              <button
                onClick={() => setTimeout(() => setStep("done"), 400)}
                className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-md bg-[var(--smc-blue)] text-[13px] font-semibold text-white hover:bg-[var(--smc-blue-dark)]"
              >
                Pay ₹{total.toLocaleString("en-IN")}
              </button>
            </div>
            <aside className="rounded-lg border border-border bg-card p-5 text-[13px]">
              <h3 className="text-[14px] font-semibold text-foreground">Order summary</h3>
              <dl className="mt-3 space-y-1.5 text-[12px]">
                <Row k={`${product.name} · ${selected.interval}`} v={`₹${selected.price.toLocaleString("en-IN")}`} />
                <Row k="GST (18%)" v={`₹${selected.gst.toLocaleString("en-IN")}`} />
              </dl>
              <div className="mt-3 border-t border-border pt-3">
                <Row k="Total" v={`₹${total.toLocaleString("en-IN")}`} bold />
              </div>
            </aside>
          </div>
        )}

        {step === "done" && (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-[var(--success-soft)] text-[var(--success)]">
              <Check className="size-6" />
            </div>
            <h2 className="text-[18px] font-bold text-foreground">Subscription activated</h2>
            <p className="mx-auto mt-1 max-w-md text-[13px] text-muted-foreground">
              {product.name} is now active for {selected.interval.toLowerCase()}. KYC, if pending, will be reviewed in parallel.
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <button
                onClick={() => navigate({ to: "/onboarding/kyc" })}
                className="rounded-md border border-border px-4 py-2 text-[13px] font-medium text-foreground hover:bg-secondary"
              >
                Complete KYC
              </button>
              <button
                onClick={() => navigate({ to: "/client" })}
                className="rounded-md bg-[var(--smc-blue)] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[var(--smc-blue-dark)]"
              >
                Go to Pulse
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "text-[14px] font-bold text-foreground" : "text-foreground/80"}`}>
      <span>{k}</span>
      <span className="tabular">{v}</span>
    </div>
  );
}