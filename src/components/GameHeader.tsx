import { Trophy, Settings } from "lucide-react";
import toLogoSm from "@/assets/TO_logo_sm_clr.svg";

interface GameHeaderProps {
  score?: number;
  showScore?: boolean;
  onSettingsToggle?: () => void;
  onAbout?: () => void;
  settingsOpen?: boolean;
}

export default function GameHeader({
  score = 0,
  showScore = false,
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
          {/* Score pill — only during gameplay */}
          {showScore && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 animate-fade-in"
              style={{
                background: "hsl(var(--game-card))",
                border: "1px solid hsl(var(--game-card-border))",
              }}
            >
              <Trophy className="w-3.5 h-3.5" style={{ color: "hsl(var(--game-gold))" }} />
              <span style={{ color: "hsl(var(--game-gold))" }}>{score}</span>
              <span className="text-muted-foreground">pts</span>
            </div>
          )}

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
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{
                background: "hsl(var(--game-card))",
                border: "1px solid hsl(var(--game-card-border))",
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
