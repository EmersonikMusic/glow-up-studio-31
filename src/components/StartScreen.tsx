import { Loader2 } from "lucide-react";
import logo from "@/assets/img-TO-logo-full-desktop.svg";
import { useIsMobile } from "@/hooks/use-mobile";
import GameHeader from "./GameHeader";
import SettingsPanel from "./SettingsPanel";
import type { GameSettings } from "./SettingsPanel";

interface StartScreenProps {
  onStart: () => void;
  onAbout: () => void;
  onLogin: () => void;
  onApply: (settings: GameSettings) => void;
  panelOpen: boolean;
  onPanelToggle: () => void;
  onPanelClose: () => void;
  loading?: boolean;
}

export default function StartScreen({ onStart, onAbout, onLogin, onApply, panelOpen, onPanelToggle, onPanelClose, loading = false }: StartScreenProps) {
  const isMobile = useIsMobile();
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: "hsl(var(--game-bg))" }}
    >
      {/* Ambient blobs */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(280 60% 50% / 0.14) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(210 70% 50% / 0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Header with settings gear and about */}
      <GameHeader
        onSettingsToggle={onPanelToggle}
        onAbout={onAbout}
        onLogin={onLogin}
        settingsOpen={panelOpen}
      />

      {/* Main content area */}
      <div className="flex flex-1 relative">
        {/* Game area — centers content, shrinks when settings panel opens */}
        <div
          className="flex flex-col items-center justify-center w-full px-4 py-8 sm:px-8 md:px-12"
          style={{
            transition: "width 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
            width: !isMobile && panelOpen ? "70%" : "100%",
          }}
        >
          {/* Logo */}
          <div className="w-full max-w-2xl animate-fade-in" style={{ animationDelay: "0ms" }}>
            <img
              src={logo}
              alt="Triviolivia — Earth's Deepest Trivia Source"
              className="w-full h-auto"
              draggable={false}
            />
          </div>

          {/* Start button — chunky game-show CTA */}
          <button
            onClick={onStart}
            disabled={loading}
            className="btn-gameshow mt-10 px-12 py-4 text-lg tracking-[0.18em] uppercase animate-fade-in inline-flex items-center justify-center gap-2"
            style={{ animationDelay: "180ms" }}
            aria-label={loading ? "Loading questions" : "Start Game"}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span>Loading…</span>
              </>
            ) : (
              "Start Game"
            )}
          </button>
        </div>
      </div>

      {/* Settings panel */}
      <SettingsPanel
        open={panelOpen}
        onToggle={onPanelToggle}
        onClose={onPanelClose}
        onAbout={onAbout}
        onApply={onApply}
      />
    </div>
  );
}
