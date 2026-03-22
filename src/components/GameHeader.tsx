import { Trophy } from "lucide-react";
import toLogoSm from "@/assets/TO_logo_sm_clr.svg";

interface GameHeaderProps {
  score: number;
  questionIndex: number;
  totalQuestions: number;
}

export default function GameHeader({ score, questionIndex, totalQuestions }: GameHeaderProps) {
  const progressPct = totalQuestions > 0 ? (questionIndex / totalQuestions) * 100 : 0;

  return (
    <header className="relative z-20 px-4 sm:px-6 pt-4 pb-3">
      {/* Top row: logo | stats */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 select-none">
          <img
            src={toLogoSm}
            alt="Trivolivia"
            className="h-8 w-auto"
            draggable={false}
          />
        </div>

        {/* Score pill */}
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0"
          style={{
            background: "hsl(var(--game-card))",
            border: "1px solid hsl(var(--game-card-border))",
          }}
        >
          <Trophy className="w-3.5 h-3.5" style={{ color: "hsl(var(--game-gold))" }} />
          <span style={{ color: "hsl(var(--game-gold))" }}>{score}</span>
          <span className="text-muted-foreground">pts</span>
        </div>

        {/* Q counter — 1-based display */}
        <div
          className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0"
          style={{
            background: "hsl(var(--game-card))",
            border: "1px solid hsl(var(--game-card-border))",
          }}
        >
          <span className="text-muted-foreground">Q</span>
          <span className="text-foreground tabular-nums">{questionIndex + 1}</span>
          <span className="text-muted-foreground">/ {totalQuestions}</span>
        </div>
      </div>

      {/* Progress bar — full width, below top row */}
      <div
        className="mt-3 h-1.5 rounded-full overflow-hidden"
        style={{ background: "hsl(var(--game-progress))" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${progressPct}%`,
            background: "linear-gradient(90deg, hsl(185 70% 50%), hsl(185 70% 65%))",
            transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
    </header>
  );
}
