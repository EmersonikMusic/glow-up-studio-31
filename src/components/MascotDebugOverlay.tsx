import { useEffect, useState, useSyncExternalStore } from "react";
import {
  getMascotTimings,
  subscribeMascotTimings,
  clearMascotTimings,
} from "@/lib/mascotDebug";

/**
 * Mascot timing debug overlay.
 *
 * Toggle with `?mascotDebug=1` in the URL or by pressing Shift+D.
 * Lists each category seen since mount with render path and worst-case
 * swap latency (ms). Inline path should consistently report ~0 ms.
 */
export default function MascotDebugOverlay() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("mascotDebug") === "1";
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === "D" || e.key === "d")) {
        // Avoid hijacking when typing in form fields.
        const t = e.target as HTMLElement | null;
        const tag = t?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || t?.isContentEditable) return;
        setEnabled((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const timings = useSyncExternalStore(
    subscribeMascotTimings,
    getMascotTimings,
    getMascotTimings,
  );

  if (!enabled) return null;

  return (
    <div
      className="fixed bottom-3 left-3 z-50 max-w-[320px] rounded-md border border-white/15 bg-black/80 p-3 font-mono text-[11px] leading-tight text-white shadow-xl backdrop-blur-sm"
      role="region"
      aria-label="Mascot debug overlay"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <strong className="text-white/90">Mascot timings</strong>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearMascotTimings}
            className="rounded bg-white/10 px-2 py-0.5 text-white/80 hover:bg-white/20"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setEnabled(false)}
            className="rounded bg-white/10 px-2 py-0.5 text-white/80 hover:bg-white/20"
            aria-label="Close debug overlay"
          >
            ×
          </button>
        </div>
      </div>
      {timings.length === 0 ? (
        <div className="text-white/60">No swaps yet…</div>
      ) : (
        <ul className="space-y-0.5">
          {timings.map((t) => (
            <li key={t.category} className="flex items-center justify-between gap-3">
              <span className="truncate">{t.category}</span>
              <span className="text-white/70">
                {t.path === "inline" ? "inline ✓" : "img"} · {t.swapMs.toFixed(1)}ms · ×{t.count}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-2 text-[10px] text-white/40">Toggle: Shift+D or ?mascotDebug=1</div>
    </div>
  );
}
