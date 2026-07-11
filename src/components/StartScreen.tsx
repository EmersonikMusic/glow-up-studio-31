import { Loader2 } from "lucide-react";
import logo from "@/assets/img-TO-logo-full-desktop-v2.svg";
import { useIsMobile } from "@/hooks/use-mobile";
import GameHeader from "./GameHeader";
import SettingsPanel from "./SettingsPanel";
import type { GameSettings } from "@/data/gameOptions";
import PrimaryCTA from "./PrimaryCTA";
import SecondaryCTA from "./SecondaryCTA";
import { useSound } from "@/hooks/useSound";
import { trackClick } from "@/lib/analytics";

interface StartScreenProps {
  onStart: () => void;
  onAbout: () => void;
  onHowToPlay: () => void;
  onPrivacy: () => void;
  onApply: (settings: GameSettings) => void;
  panelOpen: boolean;
  onPanelToggle: () => void;
  onPanelClose: () => void;
  loading?: boolean;
  customized?: boolean;
}

export default function StartScreen({ onStart, onAbout, onHowToPlay, onApply, panelOpen, onPanelToggle, onPanelClose, loading = false, customized = false }: StartScreenProps) {
  const isMobile = useIsMobile();
  const { play } = useSound();

  const handleStart = () => {
    play("start");
    onStart();
  };
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: "hsl(var(--game-bg))",
        minHeight: "var(--app-vh, 100vh)",
        maxHeight: "var(--app-vh, 100vh)",
      }}
    >
      {/* Ambient blobs */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none animate-blob-a"
        style={{
          background: "radial-gradient(circle, hsl(280 60% 50% / 0.14) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none animate-blob-b"
        style={{
          background: "radial-gradient(circle, hsl(210 70% 50% / 0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Header with settings gear and about */}
      <GameHeader
        onSettingsToggle={onPanelToggle}
        onAbout={onAbout}
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
          <h1 className="sr-only">Triviolivia — Earth's Deepest Trivia Source</h1>
          {/* Logo */}
          <div className="w-full max-w-2xl animate-fade-in animate-float-soft" style={{ animationDelay: "0ms" }}>
            <img
              src={logo}
              alt="Triviolivia — Earth's Deepest Trivia Source"
              className="w-full h-auto"
              draggable={false}
            />
          </div>

          {/* Curved tagline */}
          <div
            className="w-full max-w-xl mt-2 animate-fade-in"
            style={{ animationDelay: "90ms" }}
            aria-hidden="true"
          >
            <svg
              viewBox="-20 0 640 60"
              className="w-full h-auto"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Concave-up arc mirroring the logo's bottom curve */}
                <path
                  id="tagline-arc"
                  d="M 30 46 Q 300 14 570 46"
                  fill="none"
                />
                <filter id="tagline-shadow" x="-20%" y="-50%" width="140%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.45" />
                </filter>
              </defs>
              <text
                className="animate-text-shimmer"
                fill="hsl(185 70% 55%)"
                style={{
                  fontFamily: "'Rubik', system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: "24px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
                filter="url(#tagline-shadow)"
              >
                <textPath href="#tagline-arc" startOffset="50%" textAnchor="middle">
                  Earth's Deepest Trivia Source
                </textPath>
              </text>
            </svg>
          </div>

          {/* CTA stack — shared width so both buttons match */}
          <div className="mt-8 flex flex-col items-stretch w-fit mx-auto">
            {/* Quick Play button — logo-aligned CTA */}
            <PrimaryCTA
              onClick={handleStart}
              disabled={loading}
              trackId="start_game"
              className="w-full animate-fade-in"
              style={{ animationDelay: "180ms" }}
              aria-label={loading ? "Loading questions" : customized ? "Start Game" : "Quick Play"}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  <span>Loading…</span>
                </>
              ) : customized ? (
                "Start Game"
              ) : (
                "Quick Play"
              )}
            </PrimaryCTA>

            {/* Customize Game — opens settings panel */}
            <SecondaryCTA
              onClick={onPanelToggle}
              disabled={loading}
              trackId="customize_game"
              className="mt-3 w-full animate-fade-in"
              style={{ animationDelay: "180ms" }}
              aria-label="Customize Game"
            >
              Customize Game
            </SecondaryCTA>
          </div>


          {/* How Do I Play link */}
          <button
            onClick={() => { trackClick("click_how_to_play"); onHowToPlay(); }}
            className="howto-link mt-[22px] text-xs font-body font-semibold underline underline-offset-[5px] text-[hsl(185_70%_55%)] hover:text-[hsl(var(--game-gold))] transition-colors animate-fade-in"
            style={{ animationDelay: "240ms" }}
          >
            How to Play
          </button>
        </div>
      </div>

      {/* Copyright legal line — shifts with game area when settings open */}
      <div
        className="absolute bottom-[12px] left-0 flex justify-center pointer-events-none"
        style={{
          transition: "width 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
          width: !isMobile && panelOpen ? "70%" : "100%",
        }}
      >
        <p
          className="text-[10px] sm:text-xs font-body font-semibold text-white whitespace-nowrap animate-fade-in"
          style={{ animationDelay: "300ms" }}
        >
          Copyright © 2026 Triviolivia Inc. All rights reserved.
        </p>
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
