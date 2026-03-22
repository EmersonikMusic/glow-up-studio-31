import { Pause, Play, CheckCircle2 } from "lucide-react";
import { Question } from "@/data/questions";

interface GameFooterProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  canAdvance: boolean;
  isLast: boolean;
  onNext: () => void;
  answerCountdown: number | null;
  totalAnswerTime: number;
  selected: string | null;
  onSelect: (id: string) => void;
  paused: boolean;
  onTogglePause: () => void;
}

const difficultyColor: Record<string, string> = {
  Casual: "hsl(160 65% 50%)",
  Easy: "hsl(160 65% 50%)",
  Average: "hsl(42 100% 55%)",
  Hard: "hsl(28 90% 52%)",
  Genius: "hsl(340 70% 60%)",
};

export default function GameFooter({
  question,
  questionIndex,
  totalQuestions,
  canAdvance,
  isLast,
  onNext,
  paused,
  onTogglePause,
}: GameFooterProps) {

  return (
    <footer className="px-4 sm:px-6 md:px-8 pb-6 pt-2 w-full max-w-3xl mx-auto">

      {/* Bottom bar: metadata pill | play-pause | finish */}
      <div className="flex items-center gap-3">
        {/* Metadata pill */}
        <div
          className="flex-1 grid grid-cols-[auto_auto_1fr] sm:flex sm:flex-row items-center gap-x-2 gap-y-0 rounded-full px-4 py-2.5 text-xs font-semibold overflow-hidden"
          style={{ background: "hsl(var(--game-progress))" }}
        >
          <span className="text-muted-foreground tabular-nums">Q{questionIndex + 1}/{totalQuestions}</span>
          <span className="opacity-40">·</span>
          <span className="text-muted-foreground truncate">{question.category}</span>
          <span className="opacity-40 hidden sm:inline">·</span>
          <span
            className="font-black hidden sm:inline"
            style={{ color: difficultyColor[question.difficulty] ?? "hsl(var(--muted-foreground))" }}
          >
            {question.difficulty}
          </span>
          <span className="opacity-40 hidden md:inline">·</span>
          <span className="hidden md:inline text-muted-foreground truncate">{question.era}</span>
        </div>

        {/* Play / Pause — always visible during question AND answer phases */}
        <button
          onClick={onTogglePause}
          className="relative flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full transition-all duration-200 active:scale-95 hover:brightness-110"
          style={{
            background: "hsl(var(--game-card))",
            border: "1.5px solid hsl(var(--game-card-border))",
            color: "hsl(185 70% 55%)",
          }}
          aria-label={paused ? "Resume" : "Pause"}
        >
          {paused ? <Play className="w-4 h-4 ml-0.5" /> : <Pause className="w-4 h-4" />}
        </button>

        {/* Finish button — only on last question once answer is revealed */}
        {canAdvance && isLast && (
          <button
            onClick={onNext}
            className="relative flex items-center gap-1.5 flex-shrink-0 px-4 py-2.5 rounded-full font-black text-xs tracking-wider uppercase transition-all duration-200 active:scale-95"
            style={{
              background: "linear-gradient(135deg, hsl(280 60% 58%), hsl(280 60% 44%))",
              color: "hsl(0 0% 100%)",
              boxShadow: "0 4px 16px hsl(280 60% 50% / 0.45)",
              cursor: "pointer",
            }}
            aria-label="Finish quiz"
          >
            <CheckCircle2 className="w-4 h-4" />
            Finish
          </button>
        )}
      </div>
    </footer>
  );
}
