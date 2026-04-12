import { Settings } from "lucide-react";
import toLogoSm from "@/assets/TO_logo_sm_clr.svg";

interface GameHeaderProps {
  onSettingsToggle?: () => void;
  onAbout?: () => void;
  settingsOpen?: boolean;
}

export default function GameHeader({
  onSettingsToggle,
  onAbout,
  settingsOpen = false,
}: GameHeaderProps) {
  return (
    <header
      className="relative z-20 px-4 sm:px-6 md:px-8 backdrop-blur-md"
      style={{
        paddingTop: "clamp(0.75rem, 2vw, 1.25rem)",
        paddingBottom: "clamp(0.75rem, 2vw, 1.25rem)",
        background: "rgba(0, 0, 0, 0.25)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center flex-shrink-0 select-none">
          <img
            src={toLogoSm}
            alt="Trivolivia"
            className="h-8 w-auto"
            draggable={false}
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* About link */}
          {onAbout && (
            <button
              onClick={onAbout}
              className="hidden sm:block text-[11px] font-black tracking-widest uppercase transition-colors"
              style={{
                color: "rgba(255, 255, 255, 0.5)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.85)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)")}
            >
              About
            </button>
          )}

          {/* Settings gear */}
          {onSettingsToggle && (
            <button
              onClick={onSettingsToggle}
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
              aria-label={settingsOpen ? "Close settings" : "Open settings"}
            >
              <Settings
                className="w-4 h-4 transition-transform duration-500"
                style={{
                  color: "hsl(var(--game-gold))",
                  transform: settingsOpen ? "rotate(60deg)" : "rotate(0deg)",
                }}
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
