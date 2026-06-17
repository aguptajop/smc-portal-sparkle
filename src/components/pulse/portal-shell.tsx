import { Link, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Home, Activity, User, ListChecks, PlusCircle, Eye } from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
}

const CLIENT_NAV: NavItem[] = [
  { to: "/client", label: "Home", icon: Home },
  { to: "/client/activity", label: "Activity", icon: Activity },
  { to: "/client/profile", label: "Profile", icon: User },
];

const ANALYST_NAV: NavItem[] = [
  { to: "/analyst", label: "Queue", icon: ListChecks },
  { to: "/analyst/create", label: "Create", icon: PlusCircle },
  { to: "/analyst/preview", label: "Preview", icon: Eye },
];

export function PortalShell({
  portal,
  children,
  title,
}: {
  portal: "client" | "analyst";
  title?: string;
  children: ReactNode;
}) {
  const nav = portal === "client" ? CLIENT_NAV : ANALYST_NAV;
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/75">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid size-7 place-items-center rounded-md bg-[var(--smc-blue)] text-white font-bold text-[11px]">
              SMC
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[13px] font-bold text-[var(--smc-blue)]">Pulse</span>
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                {portal === "client" ? "Client" : "Analyst"}
              </span>
            </div>
          </Link>
          {title && (
            <div className="ml-2 truncate text-sm font-semibold text-foreground">{title}</div>
          )}
          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            {nav.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <n.icon className="size-4" />
                  {n.label}
                </Link>
              );
            })}
            <Link
              to={portal === "client" ? "/analyst" : "/client"}
              className="ml-2 rounded-md border border-border px-3 py-1.5 text-[12px] font-medium text-muted-foreground hover:bg-secondary"
            >
              Switch to {portal === "client" ? "Analyst" : "Client"}
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-5 sm:py-7">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-5xl grid-cols-3">
          {nav.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium",
                  active ? "text-[var(--smc-blue)]" : "text-muted-foreground",
                )}
              >
                <n.icon className={cn("size-5", active && "text-[var(--smc-teal)]")} />
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
      <div className="min-w-0">
        <h1 className="truncate text-[22px] font-bold tracking-tight text-foreground sm:text-[26px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-[13px] text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

export function SectionLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-2 mt-6 flex items-baseline justify-between">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
        {children}
      </h2>
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </div>
  );
}