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

  return (
    <>
      <header className="relative flex items-center justify-between px-6 py-4 z-20">
        {/* Logo */}
        <div className="flex items-center gap-1 select-none">
          <span
            className="text-3xl font-black tracking-tight leading-none"
            style={{
              fontFamily: "'Fredoka One', 'Nunito', sans-serif",
              background: "linear-gradient(135deg, hsl(42 100% 62%) 0%, hsl(35 90% 48%) 60%, hsl(42 100% 72%) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 2px 6px hsl(42 100% 55% / 0.5))",
              textShadow: "none",
            }}
          >
            TRIV
          </span>
          <span
            className="text-3xl font-black tracking-tight leading-none"
            style={{
              fontFamily: "'Fredoka One', 'Nunito', sans-serif",
              background: "linear-gradient(135deg, hsl(42 100% 62%) 0%, hsl(35 90% 48%) 60%, hsl(42 100% 72%) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 2px 6px hsl(42 100% 55% / 0.5))",
            }}
          >
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 mr-px"
              style={{
                background: "linear-gradient(135deg, hsl(42 100% 55%) 0%, hsl(35 90% 42%) 100%)",
                borderColor: "hsl(35 90% 35%)",
                WebkitTextFillColor: "hsl(240 45% 16%)",
                color: "hsl(240 45% 16%)",
                fontSize: "1rem",
              }}
            >
              O
            </span>
          </span>
          <span
            className="text-3xl font-black tracking-tight leading-none"
            style={{
              fontFamily: "'Fredoka One', 'Nunito', sans-serif",
              background: "linear-gradient(135deg, hsl(42 100% 62%) 0%, hsl(35 90% 48%) 60%, hsl(42 100% 72%) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 2px 6px hsl(42 100% 55% / 0.5))",
            }}
          >
            LIVIA
          </span>
        </div>

        {/* Score pill */}
        <div
          className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold"
          style={{ background: "hsl(var(--game-card))", border: "1px solid hsl(var(--game-card-border))" }}
        >
          <Trophy className="w-4 h-4 text-game-gold" />
          <span className="text-game-gold">{score}</span>
          <span className="text-muted-foreground">pts</span>
          <span className="mx-1 text-muted-foreground">·</span>
          <span className="text-muted-foreground">
            {questionIndex}/{totalQuestions}
          </span>
        </div>

        {/* Gear icon — opens settings panel */}
        <button
          onClick={() => setPanelOpen(true)}
          className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 hover:bg-secondary active:scale-95"
          aria-label="Open settings"
        >
          <Settings
            className="w-6 h-6 transition-transform duration-500"
            style={{
              color: "hsl(var(--game-gold))",
              transform: panelOpen ? "rotate(60deg)" : "rotate(0deg)",
            }}
          />
        </button>
      </header>

      <SettingsPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </>
  );
}
