import { Trophy, RotateCcw, Star } from "lucide-react";
import olivia from "@/assets/olivia-character.png";

interface ResultScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
}

export default function ResultScreen({ score, total, onRestart }: ResultScreenProps) {
  const percentage = Math.round((score / total) * 100);
  const rank =
    percentage >= 90
      ? { label: "Genius!", color: "hsl(340 70% 60%)" }
      : percentage >= 70
      ? { label: "Expert!", color: "hsl(42 100% 55%)" }
      : percentage >= 50
      ? { label: "Scholar!", color: "hsl(160 65% 50%)" }
      : { label: "Explorer!", color: "hsl(210 75% 60%)" };

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-8 px-6 py-8 animate-slide-in-up">
      {/* Character */}
      <div className="relative">
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center animate-float"
          style={{ background: "radial-gradient(circle, hsl(200 60% 60% / 0.3) 0%, transparent 70%)" }}
        >
          <img
            src={olivia}
            alt="Olivia"
            className="w-32 h-32 object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Score */}
      <div className="text-center">
        <div
          className="text-6xl font-black mb-2 animate-bounce-in"
          style={{ color: rank.color, fontFamily: "'Fredoka One', sans-serif" }}
        >
          {rank.label}
        </div>
        <p className="text-muted-foreground text-lg">
          You scored{" "}
          <span className="text-game-gold font-bold text-xl">{score}</span> out of{" "}
          <span className="font-bold text-xl">{total}</span> correct
        </p>
        <p className="text-muted-foreground text-sm mt-1">{percentage}% accuracy</p>
      </div>

      {/* Stars */}
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Star
            key={i}
            className="w-8 h-8 transition-all"
            fill={i < Math.round((percentage / 100) * 3) ? rank.color : "transparent"}
            stroke={rank.color}
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>

      {/* Restart button */}
      <button
        onClick={onRestart}
        className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 hover:scale-105 active:scale-95 animate-pulse-gold"
        style={{
          background: "linear-gradient(135deg, hsl(42 100% 58%), hsl(35 90% 45%))",
          color: "hsl(240 45% 16%)",
          boxShadow: "0 6px 24px hsl(42 100% 55% / 0.4)",
        }}
      >
        <RotateCcw className="w-5 h-5" />
        Play Again
      </button>
    </div>
  );
}
