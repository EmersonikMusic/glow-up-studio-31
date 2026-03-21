import { ChevronRight } from "lucide-react";
import { Question } from "@/data/questions";

interface GameFooterProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  canAdvance: boolean;
  isLast: boolean;
  onNext: () => void;
}

const difficultyColor: Record<string, string> = {
  Easy: "hsl(160 65% 50%)",
  Medium: "hsl(42 100% 55%)",
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
}: GameFooterProps) {
  const progress = (questionIndex / totalQuestions) * 100;

  return (
    <footer className="flex items-center gap-4 px-6 py-4">
      {/* Progress bar */}
      <div
        className="flex-shrink-0 w-32 md:w-48 h-3 rounded-full overflow-hidden"
        style={{ background: "hsl(var(--game-progress))" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, hsl(var(--game-gold-dark)), hsl(var(--game-gold)))",
            boxShadow: "0 0 8px hsl(42 100% 55% / 0.6)",
          }}
        />
      </div>

      {/* Metadata */}
      <div
        className="flex-1 flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs md:text-sm font-semibold text-muted-foreground"
        style={{ background: "hsl(var(--game-progress))" }}
      >
        <span>Q{questionIndex + 1}</span>
        <span className="opacity-40">·</span>
        <span>{question.category}</span>
        <span className="opacity-40">·</span>
        <span style={{ color: difficultyColor[question.difficulty] }}>{question.difficulty}</span>
        <span className="opacity-40 hidden md:inline">·</span>
        <span className="hidden md:inline truncate">{question.author}</span>
      </div>

      {/* Next / Play button */}
      <button
        onClick={onNext}
        disabled={!canAdvance}
        className="flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 flex-shrink-0"
        style={{
          background: canAdvance
            ? "linear-gradient(135deg, hsl(280 60% 58%), hsl(280 60% 44%))"
            : "hsl(var(--game-progress))",
          opacity: canAdvance ? 1 : 0.4,
          boxShadow: canAdvance ? "0 4px 16px hsl(280 60% 50% / 0.5)" : "none",
          transform: canAdvance ? "scale(1)" : "scale(0.95)",
          cursor: canAdvance ? "pointer" : "not-allowed",
        }}
        aria-label={isLast ? "Finish quiz" : "Next question"}
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>
    </footer>
  );
}
