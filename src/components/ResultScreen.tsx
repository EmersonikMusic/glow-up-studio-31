import { RotateCcw } from "lucide-react";
import mascotImg from "@/assets/Mascot.svg";

interface ResultScreenProps {
  onRestart: () => void;
}

export default function ResultScreen({ onRestart }: ResultScreenProps) {
  return (
    <div
      className="flex flex-col items-center justify-center flex-1 px-4 sm:px-6 py-8 animate-slide-in-up"
      style={{ background: "hsl(var(--game-bg))" }}
    >
      {/* Glassmorphism card */}
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden backdrop-blur-xl"
        style={{
          background: "rgba(0, 0, 0, 0.45)",
          border: "1.5px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "0 16px 64px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04)",
        }}
      >
        {/* Top accent stripe */}
        <div
          className="h-1.5 w-full"
          style={{ background: "linear-gradient(90deg, hsl(42 100% 55%), transparent)" }}
        />

        <div className="px-8 py-10 flex flex-col items-center gap-8">
          {/* Character + glow - larger for balance */}
          <div className="relative flex items-center justify-center">
            <div
              className="absolute w-40 h-40 rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(42 100% 55% / 0.35) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />
            <img
              src={mascotImg}
              alt="Olivia"
              className="relative z-10 w-32 h-32 object-contain drop-shadow-2xl animate-float"
            />
          </div>

          {/* Main heading */}
          <div className="text-center space-y-3">
            <div
              className="text-4xl sm:text-5xl font-black animate-bounce-in"
              style={{ color: "hsl(42 100% 55%)", fontFamily: "'Fredoka One', sans-serif" }}
            >
              Trivia Complete!
            </div>
            <p className="text-muted-foreground text-base max-w-xs mx-auto leading-relaxed">
              Great job exploring the world of trivia! Ready for another round?
            </p>
          </div>

          {/* Decorative divider */}
          <div className="w-16 h-0.5 rounded-full" style={{ background: "rgba(255, 255, 255, 0.15)" }} />

          {/* Fun facts or encouraging message */}
          <div
            className="w-full rounded-2xl p-5 text-center"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <p className="text-sm text-muted-foreground leading-relaxed">
              "Every question is a journey into the unknown. The more you play, the more you discover!"
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "rgba(0, 0, 0, 0.35)",
              border: "1.5px solid rgba(255, 255, 255, 0.18)",
              color: "hsl(42 100% 62%)",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.25)",
            }}
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
