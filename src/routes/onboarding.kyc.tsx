import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, ChevronLeft, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/onboarding/kyc")({
  head: () => ({
    meta: [
      { title: "KYC Verification — SMC Pulse" },
      { name: "description", content: "Complete your KYC to activate research entitlements." },
    ],
  }),
  component: KycJourney,
});

const STEPS = [
  { id: "pan", label: "PAN" },
  { id: "aadhaar", label: "Aadhaar" },
  { id: "selfie", label: "Liveness" },
  { id: "bank", label: "Bank" },
  { id: "review", label: "Review" },
];

function KycJourney() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4">
          <Link to="/client" className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-secondary">
            <ChevronLeft className="size-4" />
          </Link>
          <div className="text-[13px] font-semibold text-foreground">KYC Verification</div>
          <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-[var(--success-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--success)]">
            <ShieldCheck className="size-3" /> Encrypted
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <ol className="mb-6 grid grid-cols-5 gap-1">
          {STEPS.map((s, i) => {
            const done = i < step || submitted;
            const current = i === step && !submitted;
            return (
              <li key={s.id} className="flex flex-col items-center gap-1.5">
                <div
                  className={`grid size-7 place-items-center rounded-full text-[11px] font-bold ${
                    done
                      ? "bg-[var(--success)] text-white"
                      : current
                        ? "bg-[var(--smc-blue)] text-white"
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="size-3.5" /> : i + 1}
                </div>
                <span className={`text-[10px] uppercase tracking-wider ${current ? "text-foreground font-semibold" : "text-muted-foreground"}`}>{s.label}</span>
              </li>
            );
          })}
        </ol>

        {submitted ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-[var(--success-soft)] text-[var(--success)]">
              <Check className="size-6" />
            </div>
            <h2 className="text-[18px] font-bold text-foreground">KYC submitted</h2>
            <p className="mx-auto mt-1 max-w-md text-[13px] text-muted-foreground">
              Verification typically completes within 2 working hours. Your entitlements will activate automatically once approved.
            </p>
            <button
              onClick={() => navigate({ to: "/client" })}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-[var(--smc-blue)] px-5 text-[13px] font-semibold text-white hover:bg-[var(--smc-blue-dark)]"
            >
              Continue to Pulse
            </button>
          </div>
        ) : (
          <KycForm step={step} />
        )}

        {!submitted && (
          <div className="mt-5 flex items-center justify-between">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="rounded-md border border-border px-3 py-1.5 text-[12px] font-medium text-muted-foreground hover:bg-secondary disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                if (step === STEPS.length - 1) setSubmitted(true);
                else setStep((s) => s + 1);
              }}
              className="rounded-md bg-[var(--smc-blue)] px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-[var(--smc-blue-dark)]"
            >
              {step === STEPS.length - 1 ? "Submit for verification" : "Continue"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function KycForm({ step }: { step: number }) {
  if (step === 0) return <Field label="PAN" placeholder="ABCDE1234F" hint="As per Income Tax records." />;
  if (step === 1)
    return (
      <div className="space-y-4">
        <Field label="Aadhaar number" placeholder="•••• •••• 4821" />
        <Field label="OTP" placeholder="6-digit code" hint="Sent to the mobile linked with your Aadhaar." />
      </div>
    );
  if (step === 2)
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <div className="mx-auto mb-3 grid aspect-square w-44 place-items-center rounded-lg border-2 border-dashed border-border bg-secondary/50 text-muted-foreground">
          Camera preview
        </div>
        <p className="text-[13px] font-semibold text-foreground">Capture a quick liveness selfie</p>
        <p className="mt-1 text-[12px] text-muted-foreground">Ensure good lighting; remove glasses.</p>
      </div>
    );
  if (step === 3)
    return (
      <div className="space-y-4">
        <Field label="Account number" placeholder="•••••••••• 4821" />
        <Field label="IFSC" placeholder="HDFC0001234" />
      </div>
    );
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-[15px] font-semibold text-foreground">Review your details</h3>
      <dl className="mt-3 grid grid-cols-1 gap-3 text-[13px] sm:grid-cols-2">
        {[
          ["Name", "Aditya Mehra"],
          ["PAN", "ABCDE••••F"],
          ["Aadhaar", "XXXX XXXX 4821"],
          ["Bank", "HDFC ••••4821"],
          ["Mobile", "+91 98••• ••432"],
          ["Email", "aditya.mehra@example.in"],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
            <dd className="font-semibold text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-[11px] text-muted-foreground">
        By submitting, you authorise SMC to verify these details with statutory registries.
      </p>
    </div>
  );
}

function Field({ label, placeholder, hint }: { label: string; placeholder: string; hint?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        placeholder={placeholder}
        className="mt-1 h-10 w-full rounded-md border border-input bg-card px-3 text-[14px] outline-none focus:ring-2 focus:ring-[var(--smc-teal)]/40"
      />
      {hint && <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}