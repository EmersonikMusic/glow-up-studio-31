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
}

export default function StartScreen({ onStart, onAbout, onLogin, onApply, panelOpen, onPanelToggle, onPanelClose }: StartScreenProps) {
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

          {/* Start button — sleek game style with gradient and shine */}
          <button
            onClick={onStart}
            className="group relative mt-10 px-12 py-4 rounded-full font-black text-lg tracking-[0.18em] uppercase transition-all duration-200 animate-fade-in hover:scale-105 active:scale-[0.98] overflow-hidden"
            style={{
              animationDelay: "180ms",
              fontFamily: "'Fredoka One', 'Nunito', sans-serif",
              background: "linear-gradient(180deg, #fee62d 0%, #f3903f 50%, #e93e3a 100%)",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              boxShadow: "0 4px 12px rgba(233, 62, 58, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              color: "hsl(35 80% 25%)",
            }}
            aria-label="Start Game"
          >
            {/* Shine overlay */}
            <span 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
              }}
            />
            <span className="relative z-10 drop-shadow-sm">Start Game</span>
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
