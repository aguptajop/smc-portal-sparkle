import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PortalShell, SectionLabel } from "@/components/pulse/portal-shell";
import { supportTickets, supportTopics, relativeTime } from "@/lib/pulse-data";
import { LifeBuoy, Mail, MessageSquare, Phone, Search, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/client/help")({
  head: () => ({ meta: [{ title: "Help & Support — SMC Pulse" }] }),
  component: HelpPage,
});

function HelpPage() {
  const [q, setQ] = useState("");
  return (
    <PortalShell portal="client">
      <PageHeader title="Help & support" subtitle="Average response time under 2 hours" />

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: <Phone className="size-4" />, k: "Call", v: "1800 11 0909", hint: "Mon–Sat, 9 AM – 6 PM" },
          { icon: <Mail className="size-4" />, k: "Email", v: "support@smcpulse.in", hint: "Replies within 24h" },
          { icon: <MessageSquare className="size-4" />, k: "Live chat", v: "Open now", hint: "Trading hours" },
        ].map((c) => (
          <div key={c.k} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-[var(--smc-blue)]">{c.icon}<span className="text-[11px] font-semibold uppercase tracking-wider">{c.k}</span></div>
            <p className="mt-1 text-[14px] font-semibold text-foreground">{c.v}</p>
            <p className="text-[11px] text-muted-foreground">{c.hint}</p>
          </div>
        ))}
      </div>

      <SectionLabel>Search the help centre</SectionLabel>
      <div className="flex items-center rounded-md border border-input bg-card focus-within:ring-2 focus-within:ring-[var(--smc-teal)]/40">
        <span className="grid size-10 place-items-center text-muted-foreground"><Search className="size-4" /></span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. how do I cancel my subscription?"
          className="h-10 flex-1 bg-transparent text-[14px] outline-none"
        />
      </div>

      <SectionLabel>Browse topics</SectionLabel>
      <ul className="grid gap-2 sm:grid-cols-2">
        {supportTopics.map((t) => (
          <li key={t.id}>
            <button className="flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left hover:border-[var(--smc-teal)]/40">
              <span className="grid size-8 place-items-center rounded-md bg-accent text-[var(--smc-blue)]"><LifeBuoy className="size-4" /></span>
              <span className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-foreground">{t.title}</p>
                <p className="text-[11px] text-muted-foreground">{t.count} articles</p>
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          </li>
        ))}
      </ul>

      <SectionLabel hint={`${supportTickets.length} ticket${supportTickets.length === 1 ? "" : "s"}`}>Your tickets</SectionLabel>
      <ul className="space-y-2">
        {supportTickets.map((t) => (
          <li key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-card p-3">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-foreground">{t.subject}</p>
              <p className="text-[11px] text-muted-foreground">{t.id} · Updated {relativeTime(t.at)}</p>
            </div>
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                t.status === "OPEN" ? "bg-[var(--warning-soft)] text-[var(--warning)]" : "bg-[var(--success-soft)] text-[var(--success)]"
              }`}
            >
              {t.status}
            </span>
          </li>
        ))}
      </ul>

      <button className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-[var(--smc-blue)] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[var(--smc-blue-dark)]">
        <MessageSquare className="size-4" /> Raise a new ticket
      </button>
    </PortalShell>
  );
}