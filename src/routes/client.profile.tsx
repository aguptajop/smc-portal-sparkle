import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import { currentUser, subscriptions } from "@/lib/pulse-data";
import { getProduct } from "@/lib/mock-data";
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
  const active = subscriptions.filter((s) => s.status === "ACTIVE" || s.status === "EXPIRING");
  return (
    <PortalShell portal="client" title="Profile">
      <PageHeader title="Profile" subtitle="Account, subscriptions and settings." />

      <SectionLabel>Account</SectionLabel>
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <div className="grid size-11 place-items-center rounded-full bg-accent text-[var(--smc-blue)] font-bold">
            {currentUser.name
              .split(" ")
              .map((s) => s[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-foreground">{currentUser.name}</p>
            <p className="truncate text-[12px] text-muted-foreground tabular">{currentUser.phone}</p>
            <p className="truncate text-[12px] text-muted-foreground">{currentUser.email}</p>
          </div>
          <button className="rounded-md border border-border px-3 py-1.5 text-[12px] font-medium text-muted-foreground hover:bg-secondary">
            Edit
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-[12px]">
          <Info icon={<Phone className="size-3.5" />} k="Client code" v={currentUser.clientCode} />
          <Info icon={<Shield className="size-3.5" />} k="KYC" v={currentUser.kycStatus} />
        </div>
      </div>

      <SectionLabel hint={`${active.length} active`}>Subscriptions</SectionLabel>
      <div className="grid gap-2">
        {active.map((s) => {
          const p = getProduct(s.productId);
          if (!p) return null;
          return (
            <Link
              to="/client/subscription"
              key={s.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-[13px] hover:border-[var(--smc-teal)]/40"
            >
              <span className="font-medium text-foreground">
                {p.name}
                <span
                  className={`ml-2 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    s.status === "ACTIVE"
                      ? "bg-[var(--success-soft)] text-[var(--success)]"
                      : "bg-[var(--warning-soft)] text-[var(--warning)]"
                  }`}
                >
                  {s.status}
                </span>
              </span>
              <span className="text-[12px] text-muted-foreground tabular">
                Valid until {p.validUntil ?? "—"}
              </span>
            </Link>
          );
        })}
      </div>

      <SectionLabel>Settings</SectionLabel>
      <div className="grid gap-2">
        <RowLink to="/client/settings" icon={<Bell className="size-4" />} label="Notification preferences" />
        <RowLink to="/client/settings" icon={<Settings className="size-4" />} label="Manage devices" />
        <RowLink to="/client/bookmarks" icon={<Bookmark className="size-4" />} label="Saved items" />
        <RowLink to="/client/subscription" icon={<Receipt className="size-4" />} label="Billing & invoices" />
        <RowLink to="/client/help" icon={<LifeBuoy className="size-4" />} label="Help & support" />
        <RowLink to="/client/help" icon={<FileText className="size-4" />} label="Terms of service" />
        <RowLink to="/client/help" icon={<Shield className="size-4" />} label="Privacy policy" />
      </div>

      <div className="mt-6">
        <Link
          to="/auth"
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-[13px] font-medium text-foreground hover:bg-secondary"
        >
          <LogOut className="size-4" /> Sign out
        </Link>
        <p className="mt-3 text-[11px] text-muted-foreground">App version 1.0.0</p>
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
      className="flex min-h-11 w-full items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-left text-[13px] font-medium text-foreground hover:bg-secondary"
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex-1">{label}</span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </Link>
  );
}