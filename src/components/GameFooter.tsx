import { ChevronRight } from "lucide-react";
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
  answerCountdown,
  totalAnswerTime,
}: GameFooterProps) {
  const progress = (questionIndex / totalQuestions) * 100;
  void progress;

  // Arc for the answer countdown ring
  const size = 44;
  const strokeWidth = 3;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const answerProgress = answerCountdown !== null && totalAnswerTime > 0
    ? answerCountdown / totalAnswerTime
    : 1;
  const dashOffset = circumference * (1 - answerProgress);

  return (
    <footer className="flex items-center gap-4 px-6 py-4">
      {/* Metadata pill */}
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

      {/* Next button — shows countdown ring when in answered state */}
      <button
        onClick={onNext}
        disabled={!canAdvance}
        className="relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 flex-shrink-0"
        style={{
          background: canAdvance
            ? "linear-gradient(135deg, hsl(280 60% 58%), hsl(280 60% 44%))"
            : "hsl(var(--game-progress))",
          opacity: canAdvance ? 1 : 0.4,
          boxShadow: canAdvance ? "0 4px 16px hsl(280 60% 50% / 0.5)" : "none",
          cursor: canAdvance ? "pointer" : "not-allowed",
        }}
        aria-label={isLast ? "Finish quiz" : "Next question"}
      >
        <ChevronRight className="w-5 h-5 text-white relative z-10" />

        {/* Countdown ring overlay */}
        {canAdvance && answerCountdown !== null && (
          <svg
            width={size}
            height={size}
            className="absolute inset-0 -m-0.5"
            style={{ transform: "rotate(-90deg)" }}
          >
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="hsl(0 0% 100% / 0.15)"
              strokeWidth={strokeWidth}
            />
            {/* Progress arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="hsl(185 70% 55%)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 0.9s linear" }}
            />
          </svg>
        )}
      </button>
    </footer>
  );
}

