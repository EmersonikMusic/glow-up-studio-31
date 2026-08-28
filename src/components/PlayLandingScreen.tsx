import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import GameHeader from "./GameHeader";
import SettingsPanel from "./SettingsPanel";
import PrimaryCTA from "./PrimaryCTA";
import LegalFooter from "./LegalFooter";
import logoSm from "@/assets/TO_logo_sm_clr.svg";
import { useSound } from "@/hooks/useSound";
import { useIsMobile } from "@/hooks/use-mobile";
import type { GameSettings } from "@/data/gameOptions";
import { presetGradient, presetMascot, type PlayPreset } from "@/data/playSlugs";

interface PlayLandingScreenProps {
  preset: PlayPreset;
  onStart: () => void;
  onAbout: () => void;
  onHowToPlay: () => void;
  onPrivacy: () => void;
  onApply: (settings: GameSettings) => void;
  panelOpen: boolean;
  onPanelToggle: () => void;
  onPanelClose: () => void;
  onOpenProfile?: () => void;
  loading?: boolean;
}

/**
 * Themed ad-landing screen for /play/<slug>. One headline, one CTA — pressing
 * it runs the normal Quick Play flow with the preset's filter applied.
 */
export default function PlayLandingScreen({
  preset,
  onStart,
  onAbout,
  onHowToPlay,
  onPrivacy,
  onApply,
  panelOpen,
  onPanelToggle,
  onPanelClose,
  onOpenProfile,
  loading = false,
}: PlayLandingScreenProps) {
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
        background: presetGradient(preset) ?? "hsl(var(--game-bg))",
        minHeight: "var(--app-vh, 100vh)",
        maxHeight: "var(--app-vh, 100vh)",
      }}
    >
      <GameHeader
        onSettingsToggle={onPanelToggle}
        onAbout={onAbout}
        onOpenProfile={onOpenProfile}
        settingsOpen={panelOpen}
      />

      <div className="flex flex-1 relative">
        <div
          className="flex flex-col items-center justify-center w-full px-5 py-6 sm:px-8 md:px-12 overflow-y-auto"
          style={{
            transition: "width 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
            width: !isMobile && panelOpen ? "70%" : "100%",
          }}
        >
          <img
            src={presetMascot(preset)}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="w-32 sm:w-40 h-auto animate-float-soft drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]"
          />

          <h1
            className="mt-4 text-center font-heading font-extrabold uppercase tracking-[0.06em] text-white text-3xl sm:text-5xl animate-fade-in"
            style={{ textShadow: "0 3px 6px rgba(0,0,0,0.5)" }}
          >
            {preset.headline}
          </h1>

          <p
            className="mt-3 max-w-md text-center text-sm sm:text-base font-body font-semibold text-white/85 animate-fade-in"
            style={{ animationDelay: "90ms" }}
          >
            {preset.subhead}
          </p>

          <PrimaryCTA
            onClick={handleStart}
            disabled={loading}
            trackId="landing_play"
            className="mt-7 animate-fade-in"
            style={{ animationDelay: "160ms" }}
            aria-label={loading ? "Loading questions" : preset.ctaLabel}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span>Loading…</span>
              </>
            ) : (
              preset.ctaLabel
            )}
          </PrimaryCTA>

          <div
            className="mt-5 flex flex-col items-center gap-2 animate-fade-in"
            style={{ animationDelay: "220ms" }}
          >
            <button
              onClick={onHowToPlay}
              className="howto-link text-xs font-body font-semibold underline underline-offset-[5px] text-white hover:text-[hsl(var(--game-gold))] transition-colors"
            >
              How to Play
            </button>
            <Link
              to="/"
              className="howto-link inline-flex items-center gap-2 text-xs font-body font-semibold underline underline-offset-[5px] text-white/80 hover:text-[hsl(185_70%_55%)] transition-colors"
            >
              <img src={logoSm} alt="" aria-hidden="true" className="w-4 h-4" />
              Play all categories
            </Link>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-[12px] left-0 flex justify-center"
        style={{
          transition: "width 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
          width: !isMobile && panelOpen ? "70%" : "100%",
        }}
      >
        <LegalFooter onPrivacy={onPrivacy} className="animate-fade-in" style={{ animationDelay: "300ms" }} />
      </div>

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
