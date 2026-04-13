import { RotateCcw, Star } from "lucide-react";
import mascotImg from "@/assets/Mascot.svg";

interface ResultScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
}

export default function ResultScreen({ score, total, onRestart }: ResultScreenProps) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const rank =
    percentage >= 90
      ? { label: "Genius!", color: "hsl(340 70% 60%)", glow: "hsl(340 70% 60% / 0.35)" }
      : percentage >= 70
      ? { label: "Expert!", color: "hsl(42 100% 55%)", glow: "hsl(42 100% 55% / 0.35)" }
      : percentage >= 50
      ? { label: "Scholar!", color: "hsl(160 65% 50%)", glow: "hsl(160 65% 50% / 0.35)" }
      : { label: "Explorer!", color: "hsl(210 75% 60%)", glow: "hsl(210 75% 60% / 0.35)" };

  const starsFilled = Math.round((percentage / 100) * 3);

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 sm:px-6 py-8 animate-slide-in-up">
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
          style={{ background: `linear-gradient(90deg, ${rank.color}, transparent)` }}
        />

        <div className="px-8 py-8 flex flex-col items-center gap-6">
          {/* Character + glow */}
          <div className="relative flex items-center justify-center">
            <div
              className="absolute w-32 h-32 rounded-full"
              style={{
                background: `radial-gradient(circle, ${rank.glow} 0%, transparent 70%)`,
                filter: "blur(16px)",
              }}
            />
            <img
              src={mascotImg}
              alt="Olivia"
              className="relative z-10 w-28 h-28 object-contain drop-shadow-2xl animate-float"
            />
          </div>

          {/* Rank label */}
          <div className="text-center">
            <div
              className="text-5xl font-black mb-1 animate-bounce-in"
              style={{ color: rank.color, fontFamily: "'Fredoka One', sans-serif" }}
            >
              {rank.label}
            </div>
            <p className="text-muted-foreground text-sm">
              That's a solid run, trivia nerd.
            </p>
          </div>

          {/* Stats grid — inner glassmorphism */}
          <div
            className="w-full grid grid-cols-3 gap-px rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {[
              { label: "Correct", value: score, color: "hsl(160 65% 55%)" },
              { label: "Accuracy", value: `${percentage}%`, color: rank.color },
              { label: "Total", value: total, color: "hsl(var(--muted-foreground))" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 py-4"
                style={{ background: "rgba(0, 0, 0, 0.3)" }}
              >
                <span
                  className="text-2xl font-black tabular-nums"
                  style={{ color }}
                >
                  {value}
                </span>
                <span className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Stars */}
          <div className="flex gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Star
                key={i}
                className="w-8 h-8 transition-all duration-500"
                fill={i < starsFilled ? rank.color : "transparent"}
                stroke={i < starsFilled ? rank.color : "hsl(var(--muted-foreground))"}
                style={{
                  filter: i < starsFilled ? `drop-shadow(0 0 8px ${rank.glow})` : "none",
                  animationDelay: `${i * 150}ms`,
                  transform: i < starsFilled ? "scale(1.1)" : "scale(1)",
                }}
              />
            ))}
          </div>

          {/* CTA — gold gradient matching rest of UI */}
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
