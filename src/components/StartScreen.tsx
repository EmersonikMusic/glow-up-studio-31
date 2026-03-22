import logo from "@/assets/img-TO-logo-full-desktop.svg";
import startBtn from "@/assets/btn-startgame.svg";
import mascotImg from "@/assets/Mascot.svg";
import SettingsPanel from "./SettingsPanel";
import type { GameSettings } from "./SettingsPanel";

interface StartScreenProps {
  onStart: () => void;
  onAbout: () => void;
  onApply: (settings: GameSettings) => void;
  panelOpen: boolean;
  onPanelToggle: () => void;
  onPanelClose: () => void;
}

export default function StartScreen({ onStart, onAbout, onApply, panelOpen, onPanelToggle, onPanelClose }: StartScreenProps) {
  return (
    <div
      className="min-h-screen flex relative overflow-hidden"
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

      {/* Game area — 70% */}
      <div className="flex flex-col items-center justify-center flex-none" style={{ width: "70%", padding: "2rem 3rem" }}>
        {/* Logo */}
        <div className="w-full max-w-2xl animate-fade-in" style={{ animationDelay: "0ms" }}>
          <img
            src={logo}
            alt="Triviolivia — Earth's Deepest Trivia Source"
            className="w-full h-auto"
            draggable={false}
          />
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          className="mt-8 transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97] animate-fade-in"
          style={{ animationDelay: "180ms" }}
          aria-label="Start Game"
        >
          <img
            src={startBtn}
            alt="Start Game"
            className="h-20 w-auto drop-shadow-xl"
            draggable={false}
          />
        </button>
      </div>

      {/* Right column — 30%: mascot fades when sidebar is open */}
      <div
        className="flex-none flex flex-col items-center justify-end overflow-hidden"
        style={{
          width: "30%",
          paddingBottom: "2rem",
          transition: "opacity 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: panelOpen ? 0 : 1,
          pointerEvents: panelOpen ? "none" : "auto",
        }}
      >
        <img
          src={mascotImg}
          alt="TrivOlivia mascot"
          className="w-full h-auto object-contain drop-shadow-xl animate-fade-in"
          style={{
            maxHeight: "clamp(260px, 50vh, 500px)",
            maxWidth: "clamp(180px, 24vw, 320px)",
            animationDelay: "300ms",
          }}
          draggable={false}
        />
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
