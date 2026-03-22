import { useState } from "react";
import logo from "@/assets/img-TO-logo-full-desktop.svg";
import startBtn from "@/assets/btn-startgame.svg";
import SettingsPanel from "./SettingsPanel";
import type { GameSettings } from "./SettingsPanel";

interface StartScreenProps {
  onStart: () => void;
  onAbout: () => void;
  onApply: (settings: GameSettings) => void;
}

export default function StartScreen({ onStart, onAbout, onApply }: StartScreenProps) {
  const [panelOpen, setPanelOpen] = useState(true);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
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

      {/* Logo */}
      <div className="w-full max-w-3xl px-6 animate-fade-in" style={{ animationDelay: "0ms" }}>
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

      {/* Settings panel */}
      <SettingsPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onAbout={onAbout}
        onApply={onApply}
      />
    </div>
  );
}
