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

          {/* Start button — fun game style with red-to-yellow gradient */}
          <button
            onClick={onStart}
            className="mt-10 px-14 py-5 rounded-full font-black text-lg tracking-wider uppercase transition-all duration-200 animate-fade-in hover:scale-105 active:scale-95"
            style={{
              animationDelay: "180ms",
              fontFamily: "'Fredoka One', 'Nunito', sans-serif",
              background: "linear-gradient(180deg, #fee62d 0%, #fdd51b 8%, #fdca0f 16%, #fdc70c 24%, #f3903f 40%, #ed683c 60%, #e93e3a 100%)",
              border: "3px solid #8B2E2E",
              boxShadow: "0 6px 0 #8B2E2E, 0 8px 16px rgba(233, 62, 58, 0.4)",
              color: "white",
              textShadow: "2px 2px 0 #8B2E2E, -1px -1px 0 #8B2E2E, 1px -1px 0 #8B2E2E, -1px 1px 0 #8B2E2E, 1px 1px 0 #8B2E2E",
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
