import { ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useCallback } from "react";
import PrimaryCTA from "./PrimaryCTA";

interface HowToPlayScreenProps {
  onClose: () => void;
}

export default function HowToPlayScreen({ onClose }: HowToPlayScreenProps) {
  const isMobile = useIsMobile();
  const [exiting, setExiting] = useState(false);

  const handleClose = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => onClose(), isMobile ? 350 : 300);
  }, [onClose, isMobile, exiting]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "hsl(var(--game-bg))",
        willChange: "transform, opacity",
        pointerEvents: exiting ? "none" : "auto",
        transition: isMobile ? "transform 0.35s cubic-bezier(0.4, 0, 1, 1)" : "opacity 0.3s ease",
        transform: isMobile ? (exiting ? "translateX(-100%)" : "translateX(0)") : "translateX(0)",
        opacity: !isMobile && exiting ? 0 : 1,
      }}
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

      {/* Card */}
      <div
        className={`relative z-10 overflow-hidden animate-slide-in-up backdrop-blur-xl flex flex-col ${
          isMobile ? "absolute inset-0 rounded-none" : "rounded-3xl mx-4"
        }`}
        style={{
          ...(!isMobile && { width: "70vw", minWidth: "300px" }),
          background: "rgba(0, 0, 0, 0.45)",
          border: isMobile ? "none" : "1.5px solid rgba(255, 255, 255, 0.18)",
          boxShadow: isMobile
            ? "12px 0 48px rgba(0, 0, 0, 0.5)"
            : "0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04)",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="nav-btn absolute top-4 right-4 z-20 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 active:scale-95"
          aria-label="Close"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} />
        </button>

        {/* Header */}
        <div className="px-6 md:px-8 pt-10 pb-6 shrink-0" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <p className="text-sm font-subheading font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "hsl(185 70% 55%)" }}>
            Here's
          </p>
          <h1
            className="text-4xl font-heading font-extrabold uppercase leading-none tracking-tight"
            style={{
              background: "linear-gradient(160deg, hsl(42 100% 62%) 0%, hsl(35 90% 48%) 45%, hsl(28 90% 40%) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.05,
            }}
          >
            How to Play
          </h1>
        </div>

        {/* Scrollable body */}
        <div className="about-scroll-area flex-1 overflow-y-auto overscroll-contain">
          <div className="px-6 md:px-8 py-7 flex flex-col gap-6 game-text-white">
            {/* Customize */}
            <div>
              <h2 className="text-xs font-subheading font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "hsl(185 70% 55%)" }}>
                Customize Your Game
              </h2>
              <p className="text-sm leading-relaxed font-body font-semibold">
                Open the settings panel to make the game your own. Pick your favorite{" "}
                <span className="font-black">categories</span> and{" "}
                <span className="font-black">eras</span>, set a custom{" "}
                <span className="font-black">difficulty</span>, choose how many{" "}
                <span className="font-black">questions per game</span>, and dial in the{" "}
                <span className="font-black">speed</span> at which they rotate.
              </p>
            </div>

            <div className="h-px" style={{ background: "rgba(255, 255, 255, 0.1)" }} />

            {/* Gameplay */}
            <div>
              <h2 className="text-xs font-subheading font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "hsl(185 70% 55%)" }}>
                How to Play
              </h2>
              <p className="text-sm leading-relaxed font-body font-semibold">
                Apply your settings and press <span className="font-black">START GAME</span>. Each question is displayed
                for the amount of time you chose — try to answer it{" "}
                <span className="font-black">before the timer runs out!</span> When time is up, the answer is revealed.
              </p>
            </div>

            <div className="h-px" style={{ background: "rgba(255, 255, 255, 0.1)" }} />

            {/* Pause */}
            <div>
              <h2 className="text-xs font-subheading font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "hsl(185 70% 55%)" }}>
                Pause Anytime
              </h2>
              <p className="text-sm leading-relaxed font-body font-semibold">
                Need a break? You can <span className="font-black">pause the game</span> at any time using the pause
                button in the footer.
              </p>
            </div>

            <div className="h-px" style={{ background: "rgba(255, 255, 255, 0.1)" }} />

            {/* Changing settings */}
            <div>
              <h2 className="text-xs font-subheading font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "hsl(185 70% 55%)" }}>
                Changing Settings Mid-Game
              </h2>
              <p className="text-sm leading-relaxed font-body font-semibold">
                Want to switch things up? Open the settings panel, pick your new settings, and apply them.{" "}
                <span className="font-black">Note:</span> applying new settings will start a new game!
              </p>
            </div>

            {/* Sign-off */}
            <div className="pt-1 pb-2">
              <p className="text-sm leading-relaxed font-body font-semibold" style={{ color: "hsl(185 70% 55%)" }}>
                Now go,
                <br />
                <span className="font-black not-italic">Nerd up!</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 md:px-8 pb-8 pt-4 shrink-0 flex justify-center" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <PrimaryCTA onClick={handleClose} aria-label="Back to Game">
            Back to Game
          </PrimaryCTA>
        </div>
      </div>
    </div>
  );
}
