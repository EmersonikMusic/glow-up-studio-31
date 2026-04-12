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
    <header className="relative z-20 px-4 sm:px-6 pt-4 pb-3">
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
        <div className="flex items-center gap-2 sm:gap-3">

          {/* About link — subtle, desktop only */}
          {onAbout && (
            <button
              onClick={onAbout}
              className="hidden sm:block text-[10px] font-black tracking-widest text-muted-foreground hover:text-foreground transition-colors uppercase"
            >
              About
            </button>
          )}

          {/* Settings gear */}
          {onSettingsToggle && (
            <button
              onClick={onSettingsToggle}
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:brightness-110 active:scale-95 backdrop-blur-md"
              style={{
                background: "rgba(0, 0, 0, 0.35)",
                border: "1.5px solid rgba(255, 255, 255, 0.18)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
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
