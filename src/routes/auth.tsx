import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Smartphone } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — SMC Pulse" },
      { name: "description", content: "Sign in to SMC Pulse to access your research and recommendations." },
    ],
  }),
  component: AuthScreen,
});

function AuthScreen() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_minmax(420px,520px)]">
      <aside className="hidden bg-gradient-to-br from-[var(--smc-blue)] to-[var(--smc-blue-dark)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-md bg-white text-[var(--smc-blue)] font-bold text-[12px]">
            SMC
          </div>
          <div className="leading-none">
            <p className="text-[15px] font-bold">Pulse</p>
            <p className="text-[10px] uppercase tracking-widest text-white/70">Research & Advisory</p>
          </div>
        </div>
        <div className="space-y-5 max-w-md">
          <h1 className="text-[28px] font-bold leading-tight">
            One client hub for every SMC research subscription.
          </h1>
          <p className="text-[14px] leading-relaxed text-white/80">
            Recommendations, commentary, IPO/OFS access, and your subscription — all in one transparent, audit-ready record.
          </p>
          <ul className="space-y-2 text-[13px] text-white/80">
            <li className="flex items-center gap-2"><ShieldCheck className="size-4" /> SEBI-registered research, append-only timeline.</li>
            <li className="flex items-center gap-2"><ShieldCheck className="size-4" /> Two-factor secured. Sessions you control.</li>
            <li className="flex items-center gap-2"><ShieldCheck className="size-4" /> Pulse first. Telegram optional.</li>
          </ul>
        </div>
        <p className="text-[11px] text-white/60">© SMC Global Securities Ltd · Research compliant with SEBI (RA) Regulations.</p>
      </aside>

      <section className="flex flex-col justify-center p-6 sm:p-10">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="grid size-8 place-items-center rounded-md bg-[var(--smc-blue)] text-white font-bold text-[11px]">SMC</div>
            <span className="text-[14px] font-bold text-[var(--smc-blue)]">Pulse</span>
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--smc-teal)]">
            {step === "phone" ? "Sign in" : "Verify"}
          </p>
          <h2 className="mt-1 text-[22px] font-bold tracking-tight text-foreground">
            {step === "phone" ? "Welcome back" : "Enter the 6-digit code"}
          </h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {step === "phone"
              ? "Use your registered mobile number to continue."
              : `We sent a code to ${phone || "your phone"}. It expires in 10 minutes.`}
          </p>

          {step === "phone" ? (
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);
                if (!/^\d{10}$/.test(phone.replace(/\s/g, ""))) {
                  setError("Enter a valid 10-digit mobile number.");
                  return;
                }
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  setStep("otp");
                }, 600);
              }}
            >
              <label className="block">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Mobile number</span>
                <div className="mt-1 flex items-center rounded-md border border-input bg-card focus-within:ring-2 focus-within:ring-[var(--smc-teal)]/40">
                  <span className="grid size-10 place-items-center text-muted-foreground"><Smartphone className="size-4" /></span>
                  <span className="text-[13px] font-semibold text-foreground">+91</span>
                  <input
                    inputMode="numeric"
                    autoComplete="tel-national"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9 ]/g, ""))}
                    placeholder="98••• ••432"
                    className="ml-2 h-10 flex-1 bg-transparent text-[14px] outline-none"
                  />
                </div>
              </label>
              {error && <p className="text-[12px] text-[var(--danger)]" role="alert">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[var(--smc-blue)] text-[13px] font-semibold text-white hover:bg-[var(--smc-blue-dark)] disabled:opacity-60"
              >
                {loading ? "Sending OTP…" : (<>Continue <ArrowRight className="size-4" /></>)}
              </button>
              <p className="text-center text-[11px] text-muted-foreground">
                New to SMC? <a href="/onboarding/subscribe" className="font-semibold text-[var(--smc-blue)]">Open an account</a>
              </p>
            </form>
          ) : (
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);
                if (!/^\d{6}$/.test(otp)) {
                  setError("Enter the 6-digit OTP.");
                  return;
                }
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  navigate({ to: "/client" });
                }, 600);
              }}
            >
              <label className="block">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">One-time password</span>
                <input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                  placeholder="••••••"
                  className="mt-1 h-12 w-full rounded-md border border-input bg-card text-center text-[20px] tracking-[0.5em] tabular outline-none focus:ring-2 focus:ring-[var(--smc-teal)]/40"
                />
              </label>
              {error && <p className="text-[12px] text-[var(--danger)]" role="alert">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[var(--smc-blue)] text-[13px] font-semibold text-white hover:bg-[var(--smc-blue-dark)] disabled:opacity-60"
              >
                {loading ? "Verifying…" : "Verify & continue"}
              </button>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <button type="button" className="hover:text-foreground" onClick={() => setStep("phone")}>← Change number</button>
                <button type="button" className="hover:text-foreground">Resend in 0:42</button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}