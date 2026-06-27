import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

/** Sticky banner that appears when navigator.onLine flips false. */
export function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);
  if (!offline) return null;
  return (
    <div
      role="status"
      className="border-b border-[var(--warning)]/30 bg-[var(--warning-soft)]/80 px-4 py-2 text-[12px] font-medium text-[var(--warning)]"
    >
      <span className="mx-auto flex max-w-5xl items-center gap-2">
        <WifiOff className="size-3.5" /> You're offline. Showing the last saved content.
      </span>
    </div>
  );
}