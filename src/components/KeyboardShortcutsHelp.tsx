import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Discoverable "?" pill that opens a small popover with desktop keyboard
 * shortcuts. Hidden on mobile (where shortcuts don't apply).
 */
export default function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="nav-btn flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 active:scale-95"
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
        }}
        aria-label="Keyboard shortcuts"
        aria-expanded={open}
      >
        <HelpCircle className="nav-icon w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} strokeWidth={2.25} />
      </button>
      {open && (
        <>
          {/* Click-away */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute right-0 mt-2 w-64 rounded-xl p-4 z-50 backdrop-blur-xl animate-fade-in"
            style={{
              background: "rgba(0, 0, 0, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              boxShadow: "0 12px 48px rgba(0,0,0,0.5)",
            }}
            role="dialog"
            aria-label="Keyboard shortcuts"
          >
            <div className="text-xs font-heading font-extrabold uppercase tracking-widest text-white/90 mb-3">
              Keyboard Shortcuts
            </div>
            <ul className="space-y-2 text-xs font-body font-semibold text-white/80">
              {[
                ["Space", "Pause / Resume"],
                ["→ or N", "Next question"],
                ["S", "Toggle settings"],
                ["M", "Mute / Unmute"],
              ].map(([k, v]) => (
                <li key={k} className="flex items-center justify-between gap-3">
                  <kbd
                    className="px-2 py-0.5 rounded text-[10px] font-mono"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "hsl(var(--game-gold))",
                    }}
                  >
                    {k}
                  </kbd>
                  <span className="text-right">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
