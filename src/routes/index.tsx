import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ListChecks, User } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SMC Pulse — Research & Advisory" },
      {
        name: "description",
        content:
          "SMC Pulse is the research distribution and consumption platform for SMC clients and analysts. Sign in to your portal.",
      },
      { property: "og:title", content: "SMC Pulse — Research & Advisory" },
      {
        property: "og:description",
        content: "Sign in to the SMC Pulse client or analyst portal.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-4">
          <div className="flex items-center gap-2">
            <div className="grid size-7 place-items-center rounded-md bg-[var(--smc-blue)] text-white font-bold text-[11px]">
              SMC
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[13px] font-bold text-[var(--smc-blue)]">Pulse</span>
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                Research & Advisory
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--smc-teal)]">
          SMC Pulse · MVP
        </p>
        <h1 className="mt-3 text-[28px] font-bold tracking-tight text-foreground sm:text-[36px]">
          Research distribution, built for clarity and trust.
        </h1>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
          Every screen answers three questions: what changed, what is active, and what should you
          do next. Choose your portal to continue.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <PortalLink
            to="/client"
            title="Client Portal"
            tagline="Consume research. Act with confidence."
            icon={<User className="size-5" />}
          />
          <PortalLink
            to="/analyst"
            title="Analyst Portal"
            tagline="Create & publish research."
            icon={<ListChecks className="size-5" />}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
          <Link to="/auth" className="font-semibold text-[var(--smc-blue)] hover:underline">Sign in</Link>
          <span aria-hidden>·</span>
          <Link to="/onboarding/subscribe" className="font-semibold text-[var(--smc-blue)] hover:underline">Open an account</Link>
          <span aria-hidden>·</span>
          <Link to="/onboarding/kyc" className="font-semibold text-[var(--smc-blue)] hover:underline">Complete KYC</Link>
        </div>

        <p className="mt-10 text-[12px] text-muted-foreground">
          SMC Pulse is not a trading terminal, portfolio tracker, or CRM. It is your research desk.
        </p>
      </main>
    </div>
  );
}

function PortalLink({
  to,
  title,
  tagline,
  icon,
}: {
  to: string;
  title: string;
  tagline: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-[var(--smc-teal)]/40 hover:shadow-[0_2px_8px_rgba(0,58,112,0.08)]"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-lg bg-accent text-[var(--smc-blue)]">
          {icon}
        </span>
        <div className="flex-1">
          <p className="text-[15px] font-semibold text-foreground">{title}</p>
          <p className="text-[12px] text-muted-foreground">{tagline}</p>
        </div>
        <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
