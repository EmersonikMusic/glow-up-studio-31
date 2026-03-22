import { useState } from "react";
import { Trophy, Settings } from "lucide-react";
import SettingsPanel from "./SettingsPanel";

interface GameHeaderProps {
  score: number;
  questionIndex: number;
  totalQuestions: number;
}

export default function GameHeader({ score, questionIndex, totalQuestions }: GameHeaderProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const progressPct = totalQuestions > 0 ? (questionIndex / totalQuestions) * 100 : 0;

  return (
    <>
      <header className="relative z-20 px-4 sm:px-6 pt-4 pb-3">
        {/* Top row: logo | stats | gear */}
        <div className="flex items-center gap-3">
          {/* Logo wordmark — compact */}
          <div className="flex items-center gap-0.5 select-none flex-shrink-0">
            <span
              className="text-xl font-black tracking-tight leading-none"
              style={{
                fontFamily: "'Fredoka One', 'Nunito', sans-serif",
                background: "linear-gradient(135deg, hsl(42 100% 62%) 0%, hsl(35 90% 48%) 60%, hsl(42 100% 72%) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              TRIV
            </span>
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 mx-0.5 flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, hsl(42 100% 55%) 0%, hsl(35 90% 42%) 100%)",
                borderColor: "hsl(35 90% 35%)",
                fontSize: "0.7rem",
                fontWeight: 900,
                color: "hsl(240 45% 16%)",
                lineHeight: 1,
              }}
            >
              O
            </span>
            <span
              className="text-xl font-black tracking-tight leading-none"
              style={{
                fontFamily: "'Fredoka One', 'Nunito', sans-serif",
                background: "linear-gradient(135deg, hsl(42 100% 62%) 0%, hsl(35 90% 48%) 60%, hsl(42 100% 72%) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              LIVIA
            </span>
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

          {/* Q counter */}
          <div
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0"
            style={{
              background: "hsl(var(--game-card))",
              border: "1px solid hsl(var(--game-card-border))",
            }}
          >
            <span className="text-muted-foreground">Q</span>
            <span className="text-foreground tabular-nums">{questionIndex}</span>
            <span className="text-muted-foreground">/ {totalQuestions}</span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Settings gear */}
          <button
            onClick={() => setPanelOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 hover:bg-secondary active:scale-95 flex-shrink-0"
            aria-label="Open settings"
          >
            <Settings
              className="w-5 h-5 transition-transform duration-500"
              style={{
                color: "hsl(var(--game-gold))",
                transform: panelOpen ? "rotate(60deg)" : "rotate(0deg)",
              }}
            />
          </button>
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

      <SettingsPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </>
  );
}
