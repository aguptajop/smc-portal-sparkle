import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import { sessions, currentUser, relativeTime } from "@/lib/pulse-data";
import { LogOut, Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/client/settings")({
  head: () => ({ meta: [{ title: "Settings — SMC Pulse" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [prefs, setPrefs] = useState({
    pushAction: true,
    pushUpdates: true,
    pushCommentary: true,
    emailDigest: true,
    telegram: true,
    darkMode: false,
    sound: true,
  });

  return (
    <PortalShell portal="client">
      <PageHeader title="Settings" subtitle={`Signed in as ${currentUser.email}`} />

      <SectionLabel>Notifications</SectionLabel>
      <div className="rounded-lg border border-border bg-card">
        {[
          { k: "pushAction", label: "Action-required alerts", hint: "High-priority pushes you should never miss" },
          { k: "pushUpdates", label: "Recommendation updates", hint: "Entries, books, trails, exits" },
          { k: "pushCommentary", label: "Commentary & morning notes", hint: "Pinned and critical updates only by default" },
          { k: "emailDigest", label: "Daily email digest", hint: "Delivered at 8:30 AM IST on trading days" },
          { k: "telegram", label: "Telegram channel mirror", hint: "Pulse remains the primary channel" },
          { k: "sound", label: "In-app sounds" },
          { k: "darkMode", label: "Dark mode (beta)" },
        ].map((row) => (
          <Toggle
            key={row.k}
            label={row.label}
            hint={row.hint}
            checked={(prefs as Record<string, boolean>)[row.k]}
            onChange={(v) => setPrefs((p) => ({ ...p, [row.k]: v }))}
          />
        ))}
      </div>

      <SectionLabel hint={`${sessions.length} devices`}>Active sessions</SectionLabel>
      <ul className="space-y-2">
        {sessions.map((s) => (
          <li key={s.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-card p-3">
            <span className="grid size-9 place-items-center rounded-md bg-secondary text-muted-foreground">
              {s.device.toLowerCase().includes("iphone") || s.device.toLowerCase().includes("android") ? <Smartphone className="size-4" /> : <Monitor className="size-4" />}
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-foreground">
                {s.device} {s.current && <span className="ml-1 rounded bg-[var(--success-soft)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--success)]">This device</span>}
              </p>
              <p className="text-[11px] text-muted-foreground">{s.app} · {s.ip} · {s.city} · {relativeTime(s.lastActive)}</p>
            </div>
            {!s.current && (
              <button className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-secondary">
                <LogOut className="size-3" /> Revoke
              </button>
            )}
          </li>
        ))}
      </ul>

      <SectionLabel>Account</SectionLabel>
      <div className="grid gap-2 rounded-lg border border-border bg-card p-3 text-[13px]">
        <Row label="Client code" value={currentUser.clientCode} />
        <Row label="PAN" value={currentUser.panMasked} />
        <Row label="Risk profile" value={currentUser.riskProfile} />
        <Row label="Mobile" value={currentUser.phone} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link to="/client/subscription" className="rounded-md border border-border px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-secondary">
          Manage subscription
        </Link>
        <Link to="/client/help" className="rounded-md border border-border px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-secondary">
          Help & support
        </Link>
        <Link to="/auth" className="ml-auto inline-flex items-center gap-1 rounded-md bg-[var(--danger-soft)] px-3 py-1.5 text-[12px] font-semibold text-[var(--danger)] hover:bg-[var(--danger)]/15">
          <LogOut className="size-3.5" /> Sign out
        </Link>
      </div>
    </PortalShell>
  );
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-foreground">{label}</p>
        {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors",
          checked ? "bg-[var(--smc-blue)]" : "bg-border",
        )}
      >
        <span className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow transition-all", checked ? "left-[18px]" : "left-0.5")} />
      </button>
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground tabular">{value}</span>
    </div>
  );
}