import { RotateCcw } from "lucide-react";
import { useEffect } from "react";
import mascotImg from "@/assets/Mascot.svg";
import PrimaryCTA from "./PrimaryCTA";
import ConfettiBurst from "./ConfettiBurst";
import { useSound } from "@/hooks/useSound";

interface ResultScreenProps {
  onRestart: () => void;
  onChangeSettings?: () => void;
}

export default function ResultScreen({ onRestart, onChangeSettings }: ResultScreenProps) {
  const { play } = useSound();

  // Fanfare on mount.
  useEffect(() => {
    play("complete");
  }, [play]);

  return (
    <div
      className="relative flex flex-col items-center justify-center flex-1 min-h-0 overflow-hidden px-4 sm:px-6 py-4 sm:py-8 animate-slide-in-up"
      style={{ background: "hsl(var(--game-bg))" }}
    >
      <div className="premium-ambient animate-premium-drift" />
      <div className="premium-grid" />
      <div className="premium-vignette" />
      <ConfettiBurst count={14} />
      {/* Glassmorphism card */}
      <div
        className="premium-glass premium-sheen animate-glass-glow relative w-full max-w-md rounded-3xl overflow-hidden backdrop-blur-xl"
        style={{
          boxShadow: "0 24px 76px hsl(240 60% 5% / 0.58), 0 0 34px hsl(var(--game-spotlight) / 0.1), inset 0 1px 0 hsl(var(--game-glass-border) / 0.14)",
        }}
      >

        <div className="px-8 py-6 sm:py-10 flex flex-col items-center gap-5 sm:gap-8">
          {/* Character + glow - larger for balance */}
          <div className="relative flex items-center justify-center">
            <div
              className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(42 100% 55% / 0.35) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />
            <img
              src={mascotImg}
              alt="Olivia"
              className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-2xl animate-float"
            />
          </div>

          {/* Main heading */}
          <div className="text-center space-y-3">
            <div
              className="text-3xl sm:text-5xl font-heading font-extrabold animate-bounce-in"
              style={{ color: "hsl(42 100% 55%)" }}
            >
              Trivia Complete!
            </div>
            <p className="text-muted-foreground text-base max-w-xs mx-auto leading-relaxed font-body font-semibold">
              Ready for another round?
            </p>
          </div>

          {/* Decorative divider */}
          <div className="w-16 h-0.5 rounded-full" style={{ background: "rgba(255, 255, 255, 0.15)" }} />


          {/* CTAs — equal width */}
          <div className="flex flex-col items-stretch gap-3 w-full max-w-[280px] mx-auto">
            <PrimaryCTA
              onClick={onRestart}
              className="group w-full"
              aria-label="Play Again"
            >
              <RotateCcw className="w-5 h-5 transition-transform duration-500 group-hover:-rotate-[360deg]" />
              Play Again
            </PrimaryCTA>
            {onChangeSettings && (
              <button
                onClick={onChangeSettings}
                aria-label="Change Settings"
                className="nav-btn w-full rounded-full px-10 min-h-14 py-2 font-body font-bold uppercase tracking-wider text-xl transition-all duration-200 active:scale-95"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "hsl(var(--game-gold))",
                }}
              >
                Change Settings
              </button>
            )}
            <a
              href="mailto:mark.mazurek@triviolivia.com"
              className="mt-3 text-xs sm:text-sm font-body text-white/70 hover:text-white transition-colors underline-offset-4 hover:underline text-center"
            >
              Contact us at mark.mazurek@triviolivia.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
