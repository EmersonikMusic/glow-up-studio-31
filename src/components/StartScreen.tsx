import logo from "@/assets/img-TO-logo-full-desktop.svg";
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
            width: panelOpen ? "70%" : "100%",
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

          {/* Start button — glassmorphism style matching UI */}
          <button
            onClick={onStart}
            className="mt-8 px-10 py-4 rounded-2xl font-black text-base tracking-[0.15em] uppercase transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] animate-fade-in backdrop-blur-md"
            style={{
              animationDelay: "180ms",
              background: "linear-gradient(135deg, hsl(42 100% 58%), hsl(35 90% 45%))",
              color: "hsl(240 45% 16%)",
              boxShadow: "0 8px 32px hsl(42 100% 55% / 0.4), 0 0 0 1px hsl(42 100% 55% / 0.2)",
              fontFamily: "'Fredoka One', 'Nunito', sans-serif",
              letterSpacing: "0.15em",
            }}
            aria-label="Start Game"
          >
            Start Game
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
