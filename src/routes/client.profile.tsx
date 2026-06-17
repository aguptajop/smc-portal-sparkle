import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import { LogOut, Mail, Phone, Shield, FileText } from "lucide-react";

export const Route = createFileRoute("/client/profile")({
  head: () => ({
    meta: [
      { title: "Profile — SMC Pulse" },
      { name: "description", content: "Your SMC Pulse account, subscriptions and support." },
      { property: "og:title", content: "SMC Pulse — Profile" },
      { property: "og:description", content: "Manage your SMC Pulse subscriptions and account." },
    ],
  }),
  component: Profile,
});

function Profile() {
  return (
    <PortalShell portal="client" title="Profile">
      <PageHeader title="Profile" subtitle="Your account, subscriptions and support." />

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-full bg-accent text-[var(--smc-blue)] font-bold">
            AG
          </div>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-foreground">Aditya Gupta</p>
            <p className="truncate text-[12px] text-muted-foreground">Client ID · SMC10293847</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
          <Info icon={<Mail className="size-3.5" />} k="Email" v="aditya@example.com" />
          <Info icon={<Phone className="size-3.5" />} k="Phone" v="+91 98••• ••342" />
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">Last login · Today, 09:12 IST</p>
      </div>

      <SectionLabel>Subscriptions</SectionLabel>
      <div className="grid gap-2">
        {[
          { name: "Techno Funda", until: "Renews 14 Aug 2026" },
          { name: "Index Trading", until: "Renews 02 Sep 2026" },
          { name: "Commodity Mantra", until: "Renews 21 Jul 2026" },
        ].map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-[13px]"
          >
            <span className="font-medium text-foreground">{s.name}</span>
            <span className="text-[12px] text-muted-foreground">{s.until}</span>
          </div>
        ))}
      </div>

      <SectionLabel>Support & legal</SectionLabel>
      <div className="grid gap-2">
        <Row icon={<Shield className="size-4" />} label="Compliance & risk disclosure" />
        <Row icon={<FileText className="size-4" />} label="Terms of service" />
        <Row icon={<Mail className="size-4" />} label="Contact research desk" />
      </div>

      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-[13px] font-medium text-foreground hover:bg-secondary"
        >
          <LogOut className="size-4" /> Log out
        </Link>
      </div>
    </PortalShell>
  );
}

function Info({ icon, k, v }: { icon: React.ReactNode; k: string; v: string }) {
  return (
    <div>
      <p className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {icon} {k}
      </p>
      <p className="mt-0.5 font-medium text-foreground">{v}</p>
    </div>
  );
}

function Row({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-left text-[13px] font-medium text-foreground hover:bg-secondary">
      <span className="text-muted-foreground">{icon}</span>
      {label}
    </button>
  );
}