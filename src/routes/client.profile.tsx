import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import {
  LogOut,
  Mail,
  Phone,
  Shield,
  FileText,
  Bell,
  Bookmark,
  Settings,
  LifeBuoy,
  Receipt,
  ChevronRight,
} from "lucide-react";

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
          <Link
            to="/client/subscription"
            key={s.name}
            className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-[13px] hover:border-[var(--smc-teal)]/40"
          >
            <span className="font-medium text-foreground">{s.name}</span>
            <span className="text-[12px] text-muted-foreground">{s.until}</span>
          </Link>
        ))}
      </div>

      <SectionLabel>Quick access</SectionLabel>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Tile to="/client/notifications" icon={<Bell className="size-4" />} label="Notifications" />
        <Tile to="/client/bookmarks" icon={<Bookmark className="size-4" />} label="Saved" />
        <Tile to="/client/subscription" icon={<Receipt className="size-4" />} label="Billing" />
        <Tile to="/client/settings" icon={<Settings className="size-4" />} label="Settings" />
      </div>

      <SectionLabel>Support & legal</SectionLabel>
      <div className="grid gap-2">
        <RowLink to="/client/help" icon={<LifeBuoy className="size-4" />} label="Help & support" />
        <RowLink to="/client/help" icon={<Shield className="size-4" />} label="Compliance & risk disclosure" />
        <RowLink to="/client/help" icon={<FileText className="size-4" />} label="Terms of service" />
        <RowLink to="/client/help" icon={<Mail className="size-4" />} label="Contact research desk" />
      </div>

      <div className="mt-6">
        <Link
          to="/auth"
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

function RowLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-left text-[13px] font-medium text-foreground hover:bg-secondary"
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex-1">{label}</span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </Link>
  );
}

function Tile({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-4 text-[12px] font-medium text-foreground hover:border-[var(--smc-teal)]/40"
    >
      <span className="grid size-8 place-items-center rounded-md bg-accent text-[var(--smc-blue)]">{icon}</span>
      {label}
    </Link>
  );
}